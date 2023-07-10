import { useChannelMessagesGet } from '@/api/channel/channel.api';
import { IMessage } from '@/api/channel/channel.types';
import { IUserData } from '@/api/user/user.types';
import MessageItem from '@/components/chat/items/MessageItem';
import { filter, flatMap, uniqBy } from 'lodash';
import React from 'react';

interface MessageListProps {
  channelId: number;
  user: IUserData;
  // messages: IMessage[];
  // hasMore: boolean;
  // fetchNextPage: () => void;
}

function MessageList({
  channelId,
  user,
}: MessageListProps): React.ReactElement {
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
  const ref = React.useRef<HTMLDivElement>(null);

  const firstMessage = React.useMemo(
    () => messages[messages.length - 1],
    [messages]
  );

  React.useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      ref.current?.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [firstMessage]);

  return (
    <div
      ref={ref}
      className="flex flex-col space-y-4 overflow-y-auto w-full h-full hide-scrollbar pb-8"
    >
      {hasNextPage ? (
        <button
          className="underline text-sm"
          onClick={async (): Promise<void> => {
            await fetchNextPage();
          }}
        >
          Charger plus
        </button>
      ) : null}
      {messages.map((message) => (
        <MessageItem
          {...message}
          key={message.id}
          wasPreviousMessageOwn={
            messages[messages.indexOf(message) - 1]?.userId === message.userId
          }
        />
      ))}
    </div>
  );
}

export default MessageList;
