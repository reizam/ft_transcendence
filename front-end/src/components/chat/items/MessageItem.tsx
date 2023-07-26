import { IMessage } from '@/api/channel/channel.types';
import EntityAvatar from '@/components/app/image/EntityAvatar';
import { preventDefault } from '@/utils/react.util';
import { generateAcronymFromList } from '@/utils/string.util';
import Link from 'next/link';
import React from 'react';

function MessageItem(
  message: IMessage & {
    wasPreviousMessageOwn: boolean;
  }
): React.ReactElement {
  const className = React.useMemo(
    () =>
      message?.own
        ? 'text-sm bg-purple/25 max-w-2/3 px-4 py-1 rounded-lg break-all'
        : 'text-sm bg-purple max-w-2/3 px-4 py-1 rounded-lg break-all',
    [message]
  );

  return (
    <div
      style={{
        alignItems: message?.own ? 'flex-end' : 'flex-start',
      }}
      className="flex flex-col space-y-4 w-full"
    >
      {!message.wasPreviousMessageOwn && (
        <Link
          onMouseDown={preventDefault}
          href={`/profile/${message.user.id}`}
          className="flex flex-row items-center space-x-2"
        >
          <EntityAvatar
            image={message.user.profilePicture}
            acronym={generateAcronymFromList([message.user.username])}
            size={36}
          />
          <p className="text-sm">{message.user.username}</p>
        </Link>
      )}
      <div className={className}>{message.message}</div>
    </div>
  );
}

export default MessageItem;
