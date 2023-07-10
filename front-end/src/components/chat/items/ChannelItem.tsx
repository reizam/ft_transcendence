import { IChannel } from '@/api/channel/channel.types';
import EntityAvatar from '@/components/app/image/EntityAvatar';
import { generateChannelTitles } from '@/utils/channel.util';
import { preventDefault } from '@/utils/react.util';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { URLPattern } from 'next/server';
import React from 'react';
import { FaLock } from 'react-icons/fa';

interface ChannelItemProps {
  channel: IChannel;
}

function ChannelItem({ channel }: ChannelItemProps): React.ReactElement {
  const router = useRouter();

  const channelTitles = React.useMemo(
    () => generateChannelTitles(channel),
    [channel]
  );

  const pattern = new URLPattern({
    pathname: `/chat/channel/${channel.id}/*?`,
  });
  const selected = pattern.test({ pathname: router.asPath });

  return (
    <Link onMouseDown={preventDefault} href={`/chat/channel/${channel.id}`}>
      <div
        className={
          selected
            ? 'flex flex-row items-center justify-around space-x-4 w-full py-2 bg-purple/10 px-4 rounded-lg'
            : 'flex flex-row items-center justify-around space-x-4 w-full py-2 hover:bg-purple/10 px-4 rounded-lg'
        }
      >
        <EntityAvatar acronym={channelTitles.acronym} size={36} />
        <p className="text-sm flex-grow antialiased">{channelTitles.title}</p>
        {channel.isProtected && <FaLock size={16} />}
      </div>
    </Link>
  );
}

export default ChannelItem;
