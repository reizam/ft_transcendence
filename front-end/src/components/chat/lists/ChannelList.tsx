import React from 'react';
import { useInfiniteChannelsGet } from '@/api/channel/channel.api';
import Spinner from '@/components/utils/Spinner';
import { flatMap, uniqBy } from 'lodash';
import ChannelItem from '@/components/chat/items/ChannelItem';
import { IChannel } from '@/api/channel/channel.types';
import { useAuth } from '@/providers/auth/auth.context';

function ChannelList(): React.ReactElement {
  const {
    data,
    isLoading: loading,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteChannelsGet(10);

  const channels = React.useMemo(
    () =>
      uniqBy(
        flatMap(data?.pages || [], (page) => page.channels),
        'id'
      ),
    [data]
  );
  const { user: me } = useAuth();

  console.log('data loaded');

  const hasNewMessages = (channel: IChannel, userId?: number): boolean => {
    const channelUser = channel.users.find((user) => user.userId === userId);

    if (
      channelUser &&
      channel.lastMessageId &&
      (!channelUser.lastReadMessageId ||
        channelUser.lastReadMessageId < channel.lastMessageId)
    ) {
      return true;
    }
    return false;
  };

  const handleLoadMore = (): void => {
    if (hasNextPage) {
      void fetchNextPage();
    }
  };

  if (loading) {
    return (
      <Spinner
        className="flex justify-center items-center w-full h-full"
        size={12}
      />
    );
  }

  if (isError) {
    return <div>Erreur</div>;
  }

  return (
    <div className="flex flex-col space-y-1 my-8 overflow-y-auto hide-scrollbar">
      {channels.map((channel) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          hasNewMessages={hasNewMessages(channel, me?.id)}
        />
      ))}
      {hasNextPage && (
        <button
          className="text-purple text-sm underline"
          onClick={handleLoadMore}
        >
          Voir plus
        </button>
      )}
    </div>
  );
}

export default ChannelList;
