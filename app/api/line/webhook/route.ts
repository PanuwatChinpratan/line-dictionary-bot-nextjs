import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  fetchDictionary,
  formatResult,
  ParsedResult,
} from "../../../../lib/dictionary";

export const runtime = "nodejs";

interface LineTextEvent {
  type: "message";
  replyToken: string;
  message: {
    type: "text";
    text: string;
  };
}

interface WebhookRequest {
  events?: unknown[];
}

function isLineTextEvent(e: unknown): e is LineTextEvent {
  if (typeof e !== "object" || e === null) return false;
  const obj = e as Record<string, unknown>;
  const message = obj.message as Record<string, unknown> | undefined;
  return (
    obj.type === "message" &&
    typeof obj.replyToken === "string" &&
    message?.type === "text" &&
    typeof message.text === "string"
  );
}

function verifySignature(signature: string, body: string) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET || "";
  const hmac = crypto
    .createHmac("sha256", channelSecret)
    .update(body)
    .digest("base64");
  return hmac === signature;
}

async function reply(replyToken: string, text: string) {
  console.log("Sending reply with payload:", {
    replyToken,
    messages: [{ type: "text", text }],
  });

  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });

  console.log("LINE API response status:", res.status);

  const data = await res.text();
  console.log("LINE API response body:", data);

  if (!res.ok) {
    console.error("LINE reply failed", data);
  }
}


export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  console.log("[Webhook] Raw body:", bodyText);

  if (
    process.env.NODE_ENV === "production" &&
    !verifySignature(req.headers.get("x-line-signature") || "", bodyText)
  ) {
    console.error("[Webhook] Invalid signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch (err) {
    console.error("[Webhook] JSON parse error:", err);
    return new NextResponse("Bad request", { status: 400 });
  }

  const body = parsed as WebhookRequest;
  console.log("[Webhook] Parsed body:", JSON.stringify(body, null, 2));

  const events: LineTextEvent[] = Array.isArray(body.events)
    ? body.events.filter(isLineTextEvent)
    : [];

  console.log("[Webhook] Events count:", events.length);

  await Promise.all(
    events.map(async (event, index) => {
      console.log(`[Webhook] Processing event[${index}]:`, event);

      const raw = event.message.text.trim();
      const word = raw.replace(/[^A-Za-z]/g, "").toLowerCase();
      console.log(`[Webhook] Raw text: "${raw}", Parsed word: "${word}"`);

      if (!word) {
        console.warn("[Webhook] No valid English word provided");
        await reply(event.replyToken, "Please include an English word");
        return;
      }

      try {
        const result: ParsedResult = await fetchDictionary(word);
        console.log(`[Webhook] Dictionary result for "${word}":`, result);

        const message = formatResult(word, result);
        await reply(event.replyToken, message);
      } catch (err) {
        console.error(`[Webhook] Error fetching dictionary for "${word}":`, err);
        await reply(
          event.replyToken,
          `Sorry, something went wrong looking up "${word}".`
        );
      }
    })
  );

  console.log("[Webhook] Finished processing all events");
  return NextResponse.json({ ok: true });
}


