import { tool } from "ai";
import { z } from "zod";
import supabase from "../supabase/client";

const taskTool = tool({
  description:
    "Obtiene información relevante para las tareas que el usuario está buscando realizar, dependiendo de la opción elegida del usuario.",
  parameters: z.object({
    task: z
      .string()
      .describe(
        "La tarea que el usuario quiere completar. Usualmente es necesario antes preguntarle al usuario qué quiere hacer, por default la primer tarea debe ser pre-inscribirse al RFC"
      ),
  }),
  execute: async ({ task }) => {
    const query = task.split(" ").join("+");
    console.log(query);

    const { data, error } = await supabase.rpc("get_chained_tasks_by_name", {
      search_term: query,
    });

    if (error) {
      return { tasks: [] };
    }

    return { tasks: data };
  },
});

const tools = {
  tasks: taskTool,
};

export default tools;
