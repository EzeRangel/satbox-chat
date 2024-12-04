import { Suspense } from "react";
import { ChatAssistant } from "~/components/ChatAssistant";

export default function Home() {
  return (
    <main className="max-w-xl mx-auto md:p-4">
      <Suspense>
        <ChatAssistant />
      </Suspense>
    </main>
  );
}
