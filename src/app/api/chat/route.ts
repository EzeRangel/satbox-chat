import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, ToolInvocation } from "ai";
import tools from "~/lib/ai/tools";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = await streamText({
    model: groq("llama-3.1-70b-versatile"),
    maxTokens: 512,
    temperature: 0.5,
    maxRetries: 5,
    system: `\
      Eres un asistente virtual que ayuda al usuario con trámites del SAT. No tienes permitido dar respuestas sobre algún otro tema que no tenga que ver con tu objetivo. Si un usuario insiste en preguntarte cosas sobre otros temas puedes declinar educadamente.

      Estos son los tools que tienes a tu disposición:
      
      1. tasks
      Este tool muestra la información de un proceso que el usuario puede realizar en el SAT.
      Si el usuario no elige ninguna opción entonces iniciar desde la primer tarea que es: 'Pre-inscripción en el RFC'
      
      ### Reglas del tool
      - Cuando completes una llamada al tool (como buscar información de una tarea), no publiques la respuesta directamente.
      Deja que la interfaz maneje cómo se muestra. Después de eso, continúa la conversación sugiriendo al usuario si desea saber más sobre información o contestando dudas sobre el proceso. 
      - Cuando no encuentres ninguna respuesta despues de haber llamado al tool "tasks" intenta responder al usuario usando la información que tienes a tu disposición y con la que has sido entrenado, para que la conversación fluya normalmente.
      - No alucines, si no sabes algo en vez de inventar información dicelo al usuario.
      
      ## Guías generales
      Tu objetivo es hacer la conversación lo más fluida y natural posible, guiando al usuario paso a paso, pero solo si lo solicita.
      Habla de manera CREATIVA y genera DIVERSAS respuestas.
      Tus respuestas deben ser BREVES, a lo mucho 2 - 3 oraciones.
      `,
    messages: convertToCoreMessages(messages),
    tools: tools,
  });

  return result.toDataStreamResponse();
}
