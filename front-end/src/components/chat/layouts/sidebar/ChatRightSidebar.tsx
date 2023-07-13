import { IChannel } from '@/api/channel/channel.types';
import { ChatScreen } from '@/components/chat/layouts/ChatLayout';
import UserList from '@/components/chat/lists/UserList';
import { preventDefault } from '@/utils/react.util';
import Link from 'next/link';
import { useMemo } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';

interface ChatRightSidebarProps {
  screen: ChatScreen;
  channel: IChannel;
}

function ChatRightSidebar({
  screen,
  channel,
}: ChatRightSidebarProps): React.ReactElement {
  const owner = useMemo(
    () => channel.users.find((user) => user.user.id === channel.ownerId),
    [channel]
  );
  const admins = useMemo(
    () =>
      channel.users.filter(
        (user) => user.admin && user.user.id !== channel.ownerId
      ),
    [channel]
  );
  return (
    <div className="flex flex-col bg-dark-purple h-full w-1/3 rounded-xl overflow-hidden p-6">
      {screen === 'chat' && (
        <>
          <Link onMouseDown={preventDefault} href="/chat/friends">
            <FaUserFriends size={24} />
          </Link>
          <Link onMouseDown={preventDefault} href="/chat/channel/create">
            <BsPlusCircle size={24} />
          </Link>
        </>
      )}
      <UserList owner={owner} admins={admins} users={channel.users} />
    </div>
  );
}

export default ChatRightSidebar;
