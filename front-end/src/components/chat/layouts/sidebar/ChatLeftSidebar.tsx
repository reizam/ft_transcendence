import { ChatScreen } from '@/components/chat/layouts/ChatLayout';
import ChannelList from '@/components/chat/lists/ChannelList';
import { preventDefault } from '@/utils/react.util';
import Link from 'next/link';
import React from 'react';
import { BsArrowLeftCircle, BsPlusCircle } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';

interface ChatLeftSidebarProps {
  screen: ChatScreen;
}

function ChatLeftSidebar({ screen }: ChatLeftSidebarProps): React.ReactElement {
  return (
    <div className="flex flex-col bg-dark-purple h-full w-1/3 rounded-xl overflow-hidden p-6">
      <div className="flex flex-row justify-between">
        {screen === 'create' && (
          <Link onMouseDown={preventDefault} href="/chat">
            <BsArrowLeftCircle size={24} />
          </Link>
        )}
        {screen === 'chat' && (
          <>
            <Link onMouseDown={preventDefault} href="/friends">
              <FaUserFriends size={24} />
            </Link>
            <Link onMouseDown={preventDefault} href="/chat/channel/create">
              <BsPlusCircle size={24} />
            </Link>
          </>
        )}
      </div>
      <ChannelList />
    </div>
  );
}

export default ChatLeftSidebar;
