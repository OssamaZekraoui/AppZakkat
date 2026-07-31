import { NextRequest, NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Chat unavailable" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as
    | { locale?: unknown; messages?: unknown }
    | null;
  const locale = body?.locale === "ar" || body?.locale === "en" ? body.locale : "fr";
  if (!Array.isArray(body?.messages)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const messages = body.messages
    .slice(-8)
    .filter(
      (item): item is ChatMessage =>
        typeof item === "object" &&
        item !== null &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0 &&
        item.content.length <= 1000
    );
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const language = locale === "ar" ? "Arabic" : locale === "en" ? "English" : "French";
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_completion_tokens: 450,
      messages: [
        {
          role: "system",
          content: `You are Diyae's support assistant. Always answer in ${language}. Help only with using the Diyae application, Zakat basics, the admin-selected nisab, donations, registration, and support navigation. Be concise and kind. Never claim to issue a fatwa, replace a scholar, or make a religious ruling. For personal religious cases, tell the user to consult a qualified scholar. Never request passwords, OTP codes, API keys, banking credentials, or sensitive documents. If the question is unrelated or requires account intervention, direct the user to Technical support in the footer.`,
        },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Chat unavailable" }, { status: 503 });
  }
  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content;
  if (typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json({ error: "Empty response" }, { status: 503 });
  }
  return NextResponse.json({ answer: answer.trim() });
}
