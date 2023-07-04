import { IChannel } from '@/api/channel/channel.types';
import ChatPage from '@/components/chat/layouts/ChatPage';
import ChatLeftSidebar from '@/components/chat/layouts/sidebar/ChatLeftSidebar';
import ChatRightSidebar from '@/components/chat/layouts/sidebar/ChatRightSidebar';
import Spinner from '@/components/utils/Spinner';
import React from 'react';

export type ChatScreen = 'chat' | 'create' | 'settings';

interface ChatLayoutProps {
  loading?: boolean;
  title?: string;
  children?: React.ReactElement;
  screen: ChatScreen;
  topRight?: {
    icon?: React.ReactNode;
    href: string;
  };
  channel?: IChannel;
}

function ChatLayout({
  loading = false,
  title,
  children,
  screen,
  topRight,
  channel,
}: ChatLayoutProps): React.ReactElement {
  return (
    <div className="flex flex-row space-x-8 w-full h-full p-24">
      <ChatLeftSidebar screen={screen} />
      <ChatPage title={title} topRight={topRight}>
        {loading ? (
          <Spinner
            size={12}
            className="flex items-center justify-center h-full w-full"
          />
        ) : (
          children
        )}
      </ChatPage>
      {channel && <ChatRightSidebar screen={screen} channel={channel} />}
    </div>
  );
}

export default ChatLayout;
