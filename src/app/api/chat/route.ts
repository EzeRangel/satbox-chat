import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, tool, ToolInvocation } from "ai";
import supabase from "~/lib/supabase/client";

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
    temperature: 0.3,
    maxRetries: 5,
    system:
      `Eres un asistente virtual cuyo objetivo es ayudar a Freelancers en México` +
      `a entender temas fiscales y dar sus primeros pasos en el SAT.` +
      `Debes siempre iniciar dando un saludo amigable y preguntando al usuario` +
      `cómo puedes ayudarle dándole las siguientes opciones:` +
      `1. [toolName="tasks"][parameter="Pre-inscripción en el RFC"] Ayudandolo en su pre-inscripción al RFC` +
      `2. [toolName="tasks"][parameter="Inscripción en el RFC"] Ayudandolo a terminar su inscripción en el RFC en una oficina del SAT` +
      `Tus respuestas deben ser cortas, claras y concisas. No tienes permitido dar respuestas sobre` +
      `algún otro tema que no tenga que ver con tu objetivo. Si un usuario` +
      `insiste en preguntarte cosas sobre otros temas puedes declinar educadamente.` +
      `Cuando uses un tool debes esperar a que el usuario inicie la tarea para darle más contexto o ayudarlo de alguna otra manera.`,
    messages: convertToCoreMessages(messages),
    tools: {
      tasks: tool({
        description:
          "Obtiene las tareas relacionadas dependiendo de la opción elegida del usuario." +
          "Si el usuario no elige ninguna opción entonces iniciar desde la primer tarea que es: 'Pre-inscripción en el RFC'",
        parameters: z.object({
          task: z
            .string()
            .describe(
              "La tarea que el usuario quiere completar. Usualmente es necesario antes preguntarle al usuario qué quiere hacer, por default la primer tarea debe ser pre-inscribirse al RFC"
            ),
        }),
        execute: async ({ task }) => {
          console.log(task);

          const { data } = await supabase
            .from("tasks")
            .select()
            .eq("name", task)
            .limit(1)
            .single();

          return { tasks: data };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
