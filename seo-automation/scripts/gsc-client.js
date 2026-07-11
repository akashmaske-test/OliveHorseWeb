import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import { productionUrl, secretsRoot } from "./lib.js";

export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const localTokenPath = path.join(secretsRoot, "gsc-oauth.local.json");

export function configuredSiteUrl() {
  return process.env.GSC_SITE_URL || productionUrl;
}

export function oauthClient(redirectUri = "http://127.0.0.1") {
  return new google.auth.OAuth2(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET, redirectUri);
}

export function credentialsFromEnvironment() {
  if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) return { refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN };
  if (fs.existsSync(localTokenPath)) return JSON.parse(fs.readFileSync(localTokenPath, "utf8"));
  return null;
}

export function searchConsoleClient() {
  const credentials = credentialsFromEnvironment();
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_OAUTH_CLIENT_SECRET || !credentials?.refresh_token) return null;
  const client = oauthClient();
  client.setCredentials(credentials);
  return { auth: client, api: google.searchconsole({ version: "v1", auth: client }) };
}
