import http from "node:http";
import fs from "node:fs";
import { GSC_SCOPE, localTokenPath, oauthClient } from "./gsc-client.js";
import { ensureDirectories, mask, requiredEnv } from "./lib.js";

const missing = requiredEnv(["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"]);
if (missing.length) {
  console.log(`Google OAuth setup is required. Missing: ${missing.join(", ")}`);
  process.exit(0);
}

ensureDirectories();
const server = http.createServer();
server.listen(0, "127.0.0.1", async () => {
  const { port } = server.address();
  const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
  const client = oauthClient(redirectUri);
  const url = client.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: [GSC_SCOPE] });
  console.log("Open this URL in a browser and complete consent:");
  console.log(url);
  server.on("request", async (request, response) => {
    if (!request.url?.startsWith("/oauth2callback")) return response.end("Waiting for OAuth callback.");
    try {
      const code = new URL(request.url, redirectUri).searchParams.get("code");
      if (!code) throw new Error("No authorization code received.");
      const { tokens } = await client.getToken(code);
      if (!tokens.refresh_token) throw new Error("No refresh token received. Revoke existing app access and run this command again with consent.");
      fs.writeFileSync(localTokenPath, `${JSON.stringify({ refresh_token: tokens.refresh_token }, null, 2)}\n`);
      response.end("Authorization complete. You may close this tab.");
      console.log(`Saved local refresh token to ${localTokenPath}. Add GOOGLE_OAUTH_REFRESH_TOKEN=${mask(tokens.refresh_token)} to GitHub Actions secrets; never commit this file.`);
    } catch (error) {
      response.statusCode = 400;
      response.end("Authorization failed. Check the terminal for safe details.");
      console.error(error.message);
    } finally {
      server.close();
    }
  });
});
