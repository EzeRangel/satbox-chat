import { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { Message as ChatMessage, ToolInvocation } from "ai";
import TaskManager from "./TaskManager";
import { MemoizedReactMarkdown } from "./Markdown";

type Props = ChatMessage;

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className={"mb-4 text-right"}>
      <p
        className={`inline-block p-2 rounded-lg text-sm bg-primary text-primary-foreground`}
      >
        {children}
      </p>
    </div>
  );
}

export function BotMessage(props: ChatMessage) {
  return (
    <div className={`mb-4 text-left`}>
      <div className={`inline-block p-2 rounded-lg text-sm bg-muted`}>
        <MemoizedReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            ul({ children }) {
              return <ul className="list-disc list-outside">{children}</ul>;
            },
          }}
        >
          {props.content}
        </MemoizedReactMarkdown>
        {props.toolInvocations?.map((toolInvocation: ToolInvocation) => {
          const toolCallId = toolInvocation.toolCallId;

          if (toolInvocation.toolName === "tasks") {
            return (
              <div key={toolCallId}>
                {"result" in toolInvocation ? (
                  <TaskManager tasks={toolInvocation.result.tasks} />
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
                  <TaskManager tasks={toolInvocation.result.tasks} />
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
