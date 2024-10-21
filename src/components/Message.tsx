import { Message as ChatMessage, ToolInvocation } from "ai";
import { TaskCard } from "./TaskCard";

type Props = ChatMessage;

export default function Message(props: Props) {
  return (
    <div
      key={props.id}
      className={`mb-4 ${props.role === "user" ? "text-right" : "text-left"}`}
    >
      <div
        className={`inline-block p-2 rounded-lg text-sm ${
          props.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {props.content}
        {props.toolInvocations?.map((toolInvocation: ToolInvocation) => {
          const toolCallId = toolInvocation.toolCallId;

          if (toolInvocation.toolName === "tasks") {
            return (
              <div key={toolCallId}>
                {"result" in toolInvocation ? (
                  <TaskCard {...toolInvocation.result.tasks} />
                ) : (
                  <span>{toolInvocation.args.message}</span>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
