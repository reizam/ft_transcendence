import React from 'react';
import { IChannel } from '@/api/channel/channel.types';
import EntityAvatar from '@/components/app/image/EntityAvatar';
import { generateAcronymFromList } from '@/utils/string.util';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { preventDefault } from '@/utils/react.util';
import { generateChannelTitles } from '@/utils/channel.util';

interface ChannelItemProps {
  channel: IChannel;
}

function ChannelItem({ channel }: ChannelItemProps): React.ReactElement {
  const router = useRouter();

  const channelTitles = React.useMemo(
    () => generateChannelTitles(channel),
    [channel]
  );

  const href = `/chat/channel/${channel.id}`;
  const selected = router.asPath.startsWith(href);

  return (
    <Link onMouseDown={preventDefault} href={href}>
      <div
        className={
          selected
            ? 'flex flex-row items-center space-x-4 w-full py-2 bg-purple/10 px-4 rounded-lg'
            : 'flex flex-row items-center space-x-4 w-full py-2 hover:bg-purple/10 px-4 rounded-lg'
        }
      >
        <EntityAvatar acronym={channelTitles.acronym} size={36} />
        <p className="text-sm antialiased">{channelTitles.title}</p>
      </div>
    </Link>
  );
}

export default ChannelItem;
