const ALLOWED_ORIGIN = "https://mingchan1348-lang.github.io";
const MODEL = "gpt-5-mini";
const MAX_MESSAGE_CHARS = 600;
const MAX_OUTPUT_TOKENS = 180;
const COOLDOWN_SECONDS = 30;
const MAX_VISITOR_MESSAGES_PER_DAY = 12;
const MAX_SITE_MESSAGES_PER_DAY = 150;

function corsHeaders(origin) {
  const allowedOrigin = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin)
    }
  });
}

async function hash(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function secondsUntilTomorrow() {
  const now = new Date();
  const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(60, Math.ceil((tomorrow - now.getTime()) / 1000) + 60);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function extractOutput(payload) {
  if (payload.output_text) return String(payload.output_text).trim();
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) return String(content.text).trim();
    }
  }
  return "";
}

async function useQuota(visitorId, limits) {
  const visitorHash = await hash(visitorId);
  const day = today();
  const cooldownKey = `cooldown:${visitorHash}`;
  const visitorKey = `visitor:${day}:${visitorHash}`;
  const siteKey = `site:${day}`;

  if (await limits.get(cooldownKey)) {
    return { ok: false, error: "cooldown", retryAfter: COOLDOWN_SECONDS };
  }

  const [visitorRaw, siteRaw] = await Promise.all([
    limits.get(visitorKey),
    limits.get(siteKey)
  ]);
  const visitorCount = Number(visitorRaw || 0);
  const siteCount = Number(siteRaw || 0);

  if (visitorCount >= MAX_VISITOR_MESSAGES_PER_DAY || siteCount >= MAX_SITE_MESSAGES_PER_DAY) {
    return { ok: false, error: "limit" };
  }

  const ttl = secondsUntilTomorrow();
  await Promise.all([
    limits.put(cooldownKey, "1", { expirationTtl: COOLDOWN_SECONDS }),
    limits.put(visitorKey, String(visitorCount + 1), { expirationTtl: ttl }),
    limits.put(siteKey, String(siteCount + 1), { expirationTtl: ttl })
  ]);
  return { ok: true };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/chat" || request.method !== "POST") {
      return json({ ok: false, error: "not_found" }, 404, origin);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "invalid" }, 400, origin);
    }

    const message = String(data.message || "").trim();
    const visitorId = String(data.visitorId || "");
    if (!message || message.length > MAX_MESSAGE_CHARS || !/^cha_[a-zA-Z0-9_-]{12,120}$/.test(visitorId)) {
      return json({ ok: false, error: "invalid" }, 400, origin);
    }

    const quota = await useQuota(visitorId, env.CHAZEN_LIMITS);
    if (!quota.ok) return json(quota, 429, origin);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: "You are Cha, the calm customer guide for Chazen, a modern Chinese tea culture website. Help only with Chinese tea discovery, tea rituals, gifts, the Chazen Tea Test, basic tea culture, and navigating this website. Be warm, concise, and practical. Use no more than three short paragraphs. Do not diagnose health conditions, make medical claims, give legal or financial advice, or claim product availability not supplied by the visitor. If a question is unrelated, kindly say you can help with tea, rituals, gifts, or navigating Chazen.",
        input: message,
        max_output_tokens: MAX_OUTPUT_TOKENS
      })
    });

    if (!response.ok) {
      return json({ ok: false, error: "unavailable" }, 502, origin);
    }

    const answer = extractOutput(await response.json());
    return answer
      ? json({ ok: true, answer }, 200, origin)
      : json({ ok: false, error: "unavailable" }, 502, origin);
  }
};
