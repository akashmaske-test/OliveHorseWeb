import crypto from "node:crypto";
import { put } from "@vercel/blob";

export const config = { api: { bodyParser: false } };

const ALLOWED_TYPES = new Map([
  ["image/jpeg", { extension: "jpg", maxBytes: 10 * 1024 * 1024 }],
  ["image/png", { extension: "png", maxBytes: 10 * 1024 * 1024 }],
  ["image/webp", { extension: "webp", maxBytes: 10 * 1024 * 1024 }],
  ["video/mp4", { extension: "mp4", maxBytes: 50 * 1024 * 1024 }],
]);

function fail(res, status, code) { return res.status(status).json({ error: code }); }
export function isAuthorized(header, secret) { return Boolean(secret) && header === `Bearer ${secret}`; }
export function blobPathname(contentType, date = new Date(), id = crypto.randomUUID()) {
  const details = ALLOWED_TYPES.get(contentType);
  if (!details) throw new Error("unsupported_media_type");
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date).replaceAll("-", "/");
  return `social/${day}/${id}.${details.extension}`;
}
export async function readBody(req, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("payload_too_large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return fail(res, 405, "method_not_allowed");
  if (!isAuthorized(req.headers.authorization, process.env.SOCIAL_UPLOAD_SECRET)) return fail(res, 401, "unauthorized");
  const contentType = String(req.headers["content-type"] || "").split(";", 1)[0].toLowerCase();
  const details = ALLOWED_TYPES.get(contentType);
  if (!details) return fail(res, 415, "unsupported_media_type");
  const declaredSize = Number(req.headers["content-length"] || 0);
  if (declaredSize && (!Number.isSafeInteger(declaredSize) || declaredSize > details.maxBytes)) return fail(res, 413, "payload_too_large");
  try {
    const body = await readBody(req, details.maxBytes);
    if (!body.length) return fail(res, 400, "empty_payload");
    const pathname = blobPathname(contentType);
    const blob = await put(pathname, body, { access: "public", contentType, addRandomSuffix: false });
    return res.status(201).json({ url: blob.url, pathname: blob.pathname, contentType, size: body.length });
  } catch (error) {
    if (error.message === "payload_too_large") return fail(res, 413, "payload_too_large");
    console.error("Social media upload failed.");
    return fail(res, 500, "upload_failed");
  }
}
