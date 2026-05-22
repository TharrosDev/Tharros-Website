"use client";

import dynamic from "next/dynamic";

const ChatDemoSection = dynamic(() => import("./ChatDemoSection"), {
  ssr: false,
  loading: () => (
    <div className="bg-[color:var(--surface-dark)] py-20">
      <div className="page-frame">
        <div className="h-[600px] md:h-[760px] border border-[color:var(--rule-on-dark)] animate-pulse" />
      </div>
    </div>
  ),
});

export default function ChatDemoSectionWrapper() {
  return <ChatDemoSection />;
}
