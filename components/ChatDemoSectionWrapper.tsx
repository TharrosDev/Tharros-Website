"use client";

import dynamic from "next/dynamic";

const ChatDemoSection = dynamic(() => import("./ChatDemoSection"), {
  ssr: false,
  loading: () => (
    <div className="bg-[color:var(--surface)] border-t border-[color:var(--rule)] py-20">
      <div className="page-frame">
        <div className="h-[600px] md:h-[760px] border-2 border-[color:var(--rule-strong)] animate-pulse" />
      </div>
    </div>
  ),
});

export default function ChatDemoSectionWrapper() {
  return <ChatDemoSection />;
}
