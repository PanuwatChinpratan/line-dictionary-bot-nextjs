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
  if (!res.ok) {
    console.error("LINE reply failed", await res.text());
  }
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  if (
    process.env.NODE_ENV === "production" &&
    !verifySignature(req.headers.get("x-line-signature") || "", bodyText)
  ) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  const body = parsed as WebhookRequest;
  const events: LineTextEvent[] = Array.isArray(body.events)
    ? body.events.filter(isLineTextEvent)
    : [];

  await Promise.all(
    events.map(async (event) => {
      const raw = event.message.text.trim();
      const word = raw.replace(/[^A-Za-z]/g, "").toLowerCase();
        if (!word) {
        await reply(event.replyToken, "Please include an English word");
        return;
      }
      try {
        const result: ParsedResult = await fetchDictionary(word);
        const message = formatResult(word, result);
        await reply(event.replyToken, message);
      } catch {
        await reply(
          event.replyToken,
          `Sorry, something went wrong looking up "${word}".Please use English.`
        );
      }
    })
  );

  return NextResponse.json({ ok: true });
}

