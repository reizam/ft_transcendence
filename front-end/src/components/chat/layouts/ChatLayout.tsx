import ChatSidebar from '@/components/chat/layouts/sidebar/ChatSidebar';
import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

function ChatLayout({ children }: ChatLayoutProps): React.ReactElement {
  return (
    <div className="flex flex-row bg-[red] w-full h-full">
      <ChatSidebar />
      {children}
    </div>
  );
}

export default ChatLayout;
