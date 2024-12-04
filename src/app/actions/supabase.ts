"use server";
import { createClient } from "~/lib/supabase/server";

export async function findTaskByQuery(query: string) {
  const supabase = await createClient();
  const { data: taskId, error } = await supabase.rpc("search_task", { query });

  if (error) {
    return {
      error: true,
      message: error?.message,
    };
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .limit(1)
    .single();

  const { data: relationships, error: relatedTaskError } = await supabase
    .from("task_relations")
    .select("task:tasks!related_task_id(id, name)")
    .eq("task_id", taskId);

  if (relatedTaskError) {
    return {
      error: true,
      message: relatedTaskError.message,
    };
  }

  const relatedTasks = Object.values(relationships).map((value) => {
    return value.task;
  });

  return {
    task,
    relatedTasks,
  };
}
