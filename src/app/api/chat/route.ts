import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq("llama-3.1-70b-versatile"),
    maxTokens: 512,
    temperature: 0.3,
    maxRetries: 5,
    system:
      `Eres un asistente virtual cuyo objetivo es ayudar a Freelancers en México` +
      `a entender temas fiscales y dar sus primeros pasos en el SAT.` +
      `Por ejemplo: Explicar los diferentes regímenes fiscales; Cómo inscribirte en el RFC;` +
      `Qué documentación necesita para darse de alta; Qué es una e.firma; y más temas para` +
      `principiantes. ` +
      `Tus respuestas deben ser cortas, claras y concisas. No tienes permitido dar respuestas sobre` +
      `algún otro tema que no tenga que ver con tu objetivo. Si un usuario` +
      `insiste en preguntarte cosas sobre otros temas puedes declinar educadamente.`,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
