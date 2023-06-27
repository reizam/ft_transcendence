import {
  useChannelGet,
  useChannelMessagesGet,
} from '@/api/channel/channel.api';
import { IMessage } from '@/api/channel/channel.types';
import { useGetMe } from '@/api/user/user.get.api';
import MessageInput from '@/components/chat/inputs/MessageInput';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import MessageList from '@/components/chat/lists/MessageList';
import { generateChannelTitles } from '@/utils/channel.util';
import { filter, flatMap, uniqBy } from 'lodash';
import React from 'react';

interface ChannelContentProps {
  channelId: number;
}

//? refetch on event 'newMessage'
function ChannelContent({
  channelId,
}: ChannelContentProps): React.ReactElement {
  const { data: user } = useGetMe(undefined, {
    refetchOnWindowFocus: true,
  });
  const { data, hasNextPage, fetchNextPage } = useChannelMessagesGet(
    channelId,
    25,
    {
      enabled: isNaN(channelId) === false && channelId !== null,
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 5,
      staleTime: Infinity,
    }
  );
  const messages = React.useMemo(
    () =>
      uniqBy(
        filter(
          flatMap(data?.pages || [], 'messages'),
          (message: IMessage) =>
            !user?.blockedUsers.some(({ id }) => message.userId === id)
        ).reverse(),
        'id'
      ),
    [data, user?.blockedUsers]
  );

  const { data: channel, isLoading } = useChannelGet(channelId, {
    enabled: isNaN(channelId) === false && channelId !== null,
  });

  const titles = React.useMemo(
    () =>
      channel
        ? generateChannelTitles(channel)
        : {
            title: '',
            acronym: '',
          },
    [channel]
  );

  if (isLoading || !channel) {
    return <ChatLayout title="Salon" screen="create" loading />;
  }

  return (
    <ChatLayout
      title={titles.title}
      screen="create"
      topRight={{
        href: `/chat/channel/${channelId}/settings`,
      }}
      channel={channel}
    >
      <div className="flex flex-col space-y-4 justify-between w-full h-full px-4 py-8">
        <MessageList
          messages={messages}
          hasMore={!!hasNextPage}
          fetchNextPage={fetchNextPage}
        />
        <MessageInput channelId={channelId} />
      </div>
    </ChatLayout>
  );
}

export default ChannelContent;
