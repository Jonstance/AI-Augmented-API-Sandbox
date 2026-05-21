import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior developer helping a junior developer understand API responses. You know about REST APIs, HTTP status codes, and common developer tools. Be concise, practical, and specific. When you see amounts that look like they might be in minor currency units (like kobo for Nigerian naira — divide by 100), mention it. When you see timestamps, interpret them. When you see error codes, explain them. Always suggest a concrete next action. Keep responses under 300 words unless the user asks a specific question.`;

export async function POST(req: NextRequest) {
  try {
    const {
      collection,
      method,
      url,
      status,
      response,
      question,
      history = [],
    } = await req.json();

    const responsePreview = JSON.stringify(response, null, 2).slice(0, 3000);

    let userMessage: string;

    if (question) {
      userMessage = question;
    } else {
      const prompt = `I just made an API request:
- Collection: ${collection}
- Method: ${method}
- URL: ${url}
- HTTP Status: ${status}
- Response:
\`\`\`json
${responsePreview}
\`\`\`

Please explain this response.`;
      userMessage = prompt;
    }

    const messages = [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 600,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Explain error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
