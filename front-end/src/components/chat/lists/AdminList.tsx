import { IChannelUser } from '@/api/channel/channel.types';
import ChannelUserItem from '@/components/chat/items/ChannelUserItem';
import React from 'react';

interface AdminListProps {
  users: IChannelUser[];
  admins: number[];
  onChange: (admins: number[]) => void;
}

function AdminList({
  users,
  admins,
  onChange,
}: AdminListProps): React.ReactElement {
  const handleChange = (userId: number): void => {
    if (admins.includes(userId)) {
      onChange(admins.filter((id) => id !== userId));
    } else {
      onChange([...admins, userId]);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="relative flex flex-col space-y-4 bg-purple/10 rounded-lg p-4 w-full">
        <p className="text-m">Users</p>
        <div className="relative flex flex-col space-y-4 bg-purple/25 rounded-lg p-4 w-full">
          <p className="text-s">Admins</p>
          <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
            {users.map((user) => (
              <ChannelUserItem
                key={user.user.id}
                channelUser={user}
                selected={admins.includes(user.user.id)}
                onClick={(): void => handleChange(user.user.id)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
          {users.map((user) => (
            <ChannelUserItem
              key={user.user.id}
              channelUser={user}
              selected={admins.includes(user.user.id)}
              onClick={(): void => handleChange(user.user.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminList;
