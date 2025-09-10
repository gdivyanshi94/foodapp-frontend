// api.js - Netlify function proxy (place exactly where netlify.toml points)
const fetch = (...args) => import("node-fetch").then((m) => m.default(...args));

exports.handler = async (event) => {
  try {
    // Handle CORS preflight requests
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        body: ""
      };
    }

    // Base backend URL from env (set in Netlify UI). Default to your EC2 for local testing.
    const BACKEND_BASE = process.env.BACKEND_BASE || "http://3.109.184.36:6001";

    // Netlify provides rawPath/rawQueryString on newer runtimes. Fallback to path/query.
    const rawPath = event.rawPath ?? event.path ?? "";
    const rawQuery =
      event.rawQueryString ??
      (event.queryStringParameters
        ? new URLSearchParams(event.queryStringParameters).toString()
        : "");

    const prefix = "/.netlify/functions/api";
    // Compute path to forward: remove prefix if present
    const forwardPath = rawPath.startsWith(prefix)
      ? rawPath.slice(prefix.length)
      : rawPath;
    const query = rawQuery ? `?${rawQuery}` : "";
    const url = `${BACKEND_BASE}${forwardPath}${query}`;

    // Optional debug log (Netlify function logs) — comment out in prod
    console.log("Proxying to URL:", url, "Method:", event.httpMethod);

    // Prepare headers: copy incoming but remove host to avoid backend rejecting it
    const headers = Object.assign({}, event.headers);
    delete headers.host;

    // If content-type indicates JSON and body is a string, forward body directly
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : event.body;

    const resp = await fetch(url, {
      method: event.httpMethod,
      headers,
      body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : body,
    });

    const respText = await resp.text();
    const respHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    };
    // Forward content-type if present
    if (resp.headers.get("content-type"))
      respHeaders["Content-Type"] = resp.headers.get("content-type");

    return {
      statusCode: resp.status,
      headers: respHeaders,
      body: respText,
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return {
      statusCode: 502,
      body: "Proxy error: " + err.message,
    };
  }
};
