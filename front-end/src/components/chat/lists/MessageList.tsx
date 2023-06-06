import { IMessage } from '@/api/channel/channel.types';
import MessageItem from '@/components/chat/items/MessageItem';
import React, { useRef } from 'react';

interface MessageListProps {
  messages: IMessage[];
  hasMore: boolean;
  onEndReached: () => void;
}

function MessageList({
  messages,
  hasMore,
  onEndReached,
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
