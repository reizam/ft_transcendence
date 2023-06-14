import React from 'react';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import MessageInput from '@/components/chat/inputs/MessageInput';
import {
  useChannelGet,
  useChannelMessagesGet,
  useSendMessagePost,
} from '@/api/channel/channel.api';
import { generateChannelTitles } from '@/utils/channel.util';
import MessageList from '@/components/chat/lists/MessageList';
import { flatMap, uniqBy } from 'lodash';
import { IMessage } from '@/api/channel/channel.types';

interface ChannelContentProps {
  channelId: number;
}

function ChannelContent({
  channelId,
}: ChannelContentProps): React.ReactElement {
  const { data, hasNextPage, fetchNextPage, refetch } = useChannelMessagesGet(
    channelId,
    25,
    {
      enabled: isNaN(channelId) === false && channelId !== null,
      refetchOnWindowFocus: false,
    }
  );
  const messages = React.useMemo(
    () => uniqBy(flatMap(data?.pages || [], 'messages').reverse(), 'id'),
    [data]
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

  const { mutate: mutatePostMessage, isLoading: sendingMessage } =
    useSendMessagePost();

  const sendMessage = (
    message: string,
    setMessage: React.Dispatch<string>
  ): void => {
    mutatePostMessage(
      {
        channelId,
        message,
      },
      {
        onSuccess: () => {
          setMessage('');
          void refetch();
        },
      }
    );
  };

  // ? Uncomment this to enable real-time updates
  // React.useEffect(() => {
  //   const timeoutId = setInterval(() => {
  //     void refetch();
  //   }, 1000);

  //   return () => {
  //     clearInterval(timeoutId);
  //   };
  // }, []);

  if (isLoading || !channel) {
    return <ChatLayout title="Salon" screen="create" loading />;
  }

  return (
    <ChatLayout
      title={titles.title}
      screen="create"
      topLeft={{
        href: `/chat/channel/${channelId}/settings`,
      }}
    >
      <div className="flex flex-col space-y-4 justify-between w-full h-full px-4 py-8">
        <MessageList
          messages={messages}
          hasMore={!!hasNextPage}
          fetchNextPage={fetchNextPage}
        />
        <MessageInput loading={sendingMessage} onSend={sendMessage} />
      </div>
    </ChatLayout>
  );
}

export default ChannelContent;
