const RECIPIENT = "chazen24tz@gmail.com";
const CHAT_MODEL = "gpt-5-mini";
const MAX_MESSAGE_CHARS = 600;
const MAX_OUTPUT_TOKENS = 220;
const COOLDOWN_SECONDS = 30;
const MAX_VISITOR_MESSAGES_PER_DAY = 12;
const MAX_SITE_MESSAGES_PER_DAY = 150;
const CHAT_PARENT_ORIGIN = "https://mingchan1348-lang.github.io";

function doGet(e) {
  const data = e.parameter || {};
  const result = data.action === "chat"
    ? handleChat(data)
    : { ok: true };

  return data.bridge === "1"
    ? bridgeResponse(data, result)
    : response(data, result);
}

function doPost(e) {
  const data = e.parameter || {};

  if (data.website) return response(data, { ok: true });

  const subject = `Chazen inquiry: ${data.inquiryType || "Tea recommendation"}`;
  const body = [
    "New Chazen inquiry", "",
    `Name: ${data.name || "Not provided"}`,
    `Email: ${data.email || "Not provided"}`,
    `Company: ${data.company || "Not provided"}`,
    `Inquiry type: ${data.inquiryType || "Not provided"}`,
    `Quantity: ${data.quantity || "Not provided"}`,
    `Preferred timing: ${data.timing || "Not provided"}`,
    `Source: ${data.source || "Website"}`, "",
    "Message:", data.message || "Not provided"
  ].join("\n");

  MailApp.sendEmail({
    to: RECIPIENT,
    replyTo: data.email || undefined,
    subject,
    body
  });

  return response(data, { ok: true });
}

function handleChat(data) {
  const message = String(data.message || "").trim();
  const visitorId = String(data.visitorId || "");
  if (!message || message.length > MAX_MESSAGE_CHARS || !/^cha_[a-zA-Z0-9_-]{12,120}$/.test(visitorId)) {
    return { ok: false, error: "invalid" };
  }

  const quota = useQuota(visitorId);
  if (!quota.ok) return quota;

  const apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  if (!apiKey) return { ok: false, error: "unavailable" };

  const request = {
    model: CHAT_MODEL,
    instructions: [
      "You are Cha, the calm customer guide for Chazen, a modern Chinese tea culture website.",
      "Help only with Chinese tea discovery, tea rituals, gifts, the Chazen Tea Test, basic tea culture, and navigating this website.",
      "Be warm, concise, and practical. Use no more than three short paragraphs.",
      "Do not diagnose health conditions, make medical claims, give legal or financial advice, or claim product availability not supplied by the visitor.",
      "If a question is unrelated, kindly say you can help with tea, rituals, gifts, or navigating Chazen."
    ].join(" "),
    input: message,
    max_output_tokens: MAX_OUTPUT_TOKENS
  };

  try {
    const apiResponse = UrlFetchApp.fetch("https://api.openai.com/v1/responses", {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: `Bearer ${apiKey}` },
      payload: JSON.stringify(request),
      muteHttpExceptions: true
    });
    const status = apiResponse.getResponseCode();
    if (status < 200 || status >= 300) return { ok: false, error: "unavailable" };

    const answer = extractOutput(JSON.parse(apiResponse.getContentText()));
    return answer ? { ok: true, answer } : { ok: false, error: "unavailable" };
  } catch (error) {
    console.log(error);
    return { ok: false, error: "unavailable" };
  }
}

function useQuota(visitorId) {
  const hash = bytesToHex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, visitorId));
  const cache = CacheService.getScriptCache();
  const cooldownKey = `cha:cooldown:${hash}`;
  if (cache.get(cooldownKey)) return { ok: false, error: "cooldown", retryAfter: COOLDOWN_SECONDS };

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(3000)) return { ok: false, error: "busy", retryAfter: 5 };

  try {
    const props = PropertiesService.getScriptProperties();
    const day = Utilities.formatDate(new Date(), "Etc/UTC", "yyyy-MM-dd");
    const globalKey = `cha:site:${day}`;
    const visitorKey = `cha:visitor:${day}:${hash}`;
    const globalCount = Number(props.getProperty(globalKey) || 0);
    const visitorCount = Number(props.getProperty(visitorKey) || 0);

    if (globalCount >= MAX_SITE_MESSAGES_PER_DAY || visitorCount >= MAX_VISITOR_MESSAGES_PER_DAY) {
      return { ok: false, error: "limit" };
    }

    props.setProperties({
      [globalKey]: String(globalCount + 1),
      [visitorKey]: String(visitorCount + 1)
    });
    cache.put(cooldownKey, "1", COOLDOWN_SECONDS);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function extractOutput(payload) {
  if (payload.output_text) return String(payload.output_text).trim();
  const output = payload.output || [];
  for (const item of output) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) return String(content.text).trim();
    }
  }
  return "";
}

function bytesToHex(bytes) {
  return bytes.map((byte) => (byte + 256).toString(16).slice(-2)).join("");
}

function response(data, payload) {
  const callback = String(data.callback || "").replace(/[^a-zA-Z0-9_$]/g, "");
  const text = JSON.stringify(payload).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return ContentService
    .createTextOutput(callback ? `${callback}(${text});` : text)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}


function bridgeResponse(data, payload) {
  const requestId = String(data.requestId || "").replace(/[^a-zA-Z0-9_-]/g, "");
  const message = JSON.stringify({
    type: "chazen-cha-reply",
    requestId,
    payload
  }).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

  const origin = JSON.stringify(CHAT_PARENT_ORIGIN);
  const html = `<!doctype html><html><body><script>
    window.top.postMessage(${message}, ${origin});
  </script></body></html>`;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
