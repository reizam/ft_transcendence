import React from 'react';
import Link from 'next/link';
import { BsArrowLeftCircle, BsPlusCircle } from 'react-icons/bs';
import { ChatScreen } from '@/components/chat/layouts/ChatLayout';
import { FaUserFriends } from 'react-icons/fa';

interface ChatSidebarProps {
  screen: ChatScreen;
}

function ChatSidebar({ screen }: ChatSidebarProps): React.ReactElement {
  return (
    <div className="flex flex-row justify-between bg-dark-purple h-full w-1/4 rounded-xl overflow-hidden p-6">
      {screen === 'create' && (
        <Link href="/chat">
          <BsArrowLeftCircle size={24} />
        </Link>
      )}
      {screen === 'chat' && (
        <>
          <Link href="/chat/friends">
            <FaUserFriends size={24} />
          </Link>
          <Link href="/chat/channel/create">
            <BsPlusCircle size={24} />
          </Link>
        </>
      )}
    </div>
  );
}

export default ChatSidebar;
