import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "AI teacher is not configured yet. Add OPENAI_API_KEY on the server." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 1500) : "";
  if (!prompt) return NextResponse.json({ error: "Write a question first." }, { status: 400 });

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Avora Zone's friendly English teacher. Explain in simple English and Bengali when useful. Correct grammar gently, give one short example, and encourage the learner." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5
    })
  });

  const result = await upstream.json();
  if (!upstream.ok) return NextResponse.json({ error: "AI provider request failed.", detail: result?.error?.message || "Unknown error" }, { status: 502 });
  return NextResponse.json({ answer: result?.choices?.[0]?.message?.content || "I couldn't prepare an answer." });
}
