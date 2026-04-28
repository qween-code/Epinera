import { TopBar } from "@/components/topbar";
import { ChatPanel } from "@/components/chat-panel";

export default function ChatPage() {
  return (
    <>
      <TopBar
        title="Asistan"
        subtitle="Sorunu yazın, geçmiş vakalardan en yakın çözümü öner"
      />
      <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)]">
        <ChatPanel />
      </div>
    </>
  );
}
