import ChatPage from '@/components/chat/layouts/ChatPage';
import ChatSidebar from '@/components/chat/layouts/sidebar/ChatSidebar';
import Spinner from '@/components/utils/Spinner';
import React from 'react';

export type ChatScreen = 'chat' | 'create' | 'settings';

interface ChatLayoutProps {
  loading?: boolean;
  title?: string;
  children?: React.ReactElement;
  screen: ChatScreen;
  topLeft?: {
    icon?: React.ReactNode;
    href: string;
  };
}

function ChatLayout({
  loading = false,
  title,
  children,
  screen,
  topLeft,
}: ChatLayoutProps): React.ReactElement {
  return (
    <div className="flex flex-row space-x-8 w-full h-full p-24">
      <ChatSidebar screen={screen} />
      <ChatPage title={title} topLeft={topLeft}>
        {loading ? (
          <Spinner
            size={12}
            className="flex items-center justify-center h-full w-full"
          />
        ) : (
          children
        )}
      </ChatPage>
    </div>
  );
}

export default ChatLayout;
