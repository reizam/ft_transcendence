import { IMessage } from '@/api/channel/channel.types';
import MessageItem from '@/components/chat/items/MessageItem';
import React from 'react';

interface MessageListProps {
  messages: IMessage[];
  hasMore: boolean;
  fetchNextPage: () => void;
}

function MessageList({
  messages,
  hasMore,
  fetchNextPage,
}: MessageListProps): React.ReactElement {
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
      {hasMore ? (
        <button className="underline text-sm" onClick={fetchNextPage}>
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
