import React from 'react';
import { useInfiniteChannelsGet } from '@/api/channel/channel.api';
import Spinner from '@/components/utils/Spinner';
import { flatMap, uniqBy } from 'lodash';
import ChannelItem from '@/components/chat/items/ChannelItem';

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
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col space-y-1 my-8 overflow-y-auto hide-scrollbar">
      {channels.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} />
      ))}
      {hasNextPage && (
        <button
          className="text-purple text-sm underline"
          onClick={handleLoadMore}
        >
          Load more
        </button>
      )}
    </div>
  );
}

export default ChannelList;
