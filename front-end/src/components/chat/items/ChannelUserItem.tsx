import React from 'react';
import EntityAvatar from '@/components/app/image/EntityAvatar';
import { IChannelUser } from '@/api/channel/channel.types';
import { generateAcronymFromList } from '@/utils/string.util';

interface ChannelUserItemProps {
  channelUser: IChannelUser;
  selected?: boolean;
  onClick?: () => void;
}

function ChannelUserItem({
  selected = false,
  channelUser,
  onClick,
}: ChannelUserItemProps): React.ReactElement {
  return (
    <button onClick={onClick}>
      <div
        className={
          selected
            ? 'flex flex-row items-center space-x-4 w-full py-2 bg-purple/10 px-4 rounded-lg'
            : 'flex flex-row items-center space-x-4 w-full py-2 hover:bg-purple/10 px-4 rounded-lg'
        }
      >
        <EntityAvatar
          image={channelUser.user.profilePicture}
          acronym={generateAcronymFromList([channelUser.user.username])}
          size={36}
        />
        <p className="text-sm antialiased">{channelUser.user.username}</p>
      </div>
    </button>
  );
}

export default ChannelUserItem;
