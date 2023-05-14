import ChatPage from '@/components/chat/layouts/ChatPage';
import ChatSidebar from '@/components/chat/layouts/sidebar/ChatSidebar';
import React from 'react';

export type ChatScreen = 'chat' | 'create' | 'settings';

interface ChatLayoutProps {
  title?: string;
  children: React.ReactElement;
  screen: ChatScreen;
}

function ChatLayout({
  title,
  children,
  screen,
}: ChatLayoutProps): React.ReactElement {
  return (
    <div className="flex flex-row space-x-8 w-full h-full p-24">
      <ChatSidebar screen={screen} />
      <ChatPage title={title}>{children}</ChatPage>
    </div>
  );
}

export default ChatLayout;
