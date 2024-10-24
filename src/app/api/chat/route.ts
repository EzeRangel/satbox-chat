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
    system: `\
      Eres un asistente virtual que ayuda al usuario con trámites del SAT. No tienes permitido dar respuestas sobre algún otro tema que no tenga que ver con tu objetivo. Si un usuario insiste en preguntarte cosas sobre otros temas puedes declinar educadamente.

      Estos son los tools que tienes a tu disposición:
      1. tasks
      Este tool muestra los pasos de una tarea para ser completada por el usuario. Por ejemplo: Pre-inscripción al RFC.

      Cuando completes una llamada a un "tool" (como buscar información de una tarea), no publiques la respuesta directamente.
      Deja que la interfaz maneje cómo se muestra. Después de eso, continúa la conversación haciendo preguntas abiertas como: 
      "¿Puedo ayudarte con algo más?" o "¿Quieres continuar con la siguiente tarea?".

      Ejemplo: 
      User: Quiero inscribirme al RFC
      Assistant: { "tool_call": { "id": "pending", "type": "function", "function": { "name": "tasks" }, "parameters": { "task": "Pre-inscripción al RFC" } } } 

      Assistant (you): La guía que te proporcioné es lo primero que tienes que hacer para inscribirte al RFC. ¿Deseas iniciar la tarea?

      o

      User: Ya terminé la pre-inscripción al RFC
      Assistant: { "tool_call": { "id": "pending", "type": "function", "function": { "name": "tasks" }, "parameters": { "task": "Inscripción al RFC" } } } 

      Assistant (you): Genial, aquí tienes la guía para finalizar tu inscripción al RFC. Tendrá que ser en una oficina del SAT. Avisame cuándo quieras iniciarla.
      
      ## Guidelines
      Tu objetivo es hacer la conversación lo más fluida y natural posible, guiando al usuario paso a paso, pero solo si lo solicita.

      Habla como una de las respuestas provistas arriba pero se CREATIVO y genera DIVERSAS respuestas.

      Tus respuestas deben ser BREVES, a lo mucho 2 - 3 oraciones.
      `,
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
