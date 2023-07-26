import { useChannelGet, useChannelJoin } from '@/api/channel/channel.api';
import ChannelPassword, {
  ChannelPasswordValues,
} from '@/components/chat/forms/ChannelPassword';
import MessageInput from '@/components/chat/inputs/MessageInput';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import MessageList from '@/components/chat/lists/MessageList';
import { useAuth } from '@/providers/auth/auth.context';
import { generateChannelTitles } from '@/utils/channel.util';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ChannelContentProps {
  channelId: number;
}

// TODO: refetch on event 'newMessage'
function ChannelContent({
  channelId,
}: ChannelContentProps): React.ReactElement {
  const router = useRouter();
  const { user: me } = useAuth();
  const {
    data: channel,
    isLoading: channelLoading,
    isError: channelError,
  } = useChannelGet(channelId, {
    enabled: channelId !== null,
  });
  const { mutate: joinChannel } = useChannelJoin();
  const { mutate: submitPassword } = useChannelJoin();

  const passwordError = React.useRef(0);
  const handlePasswordSubmit = (values: ChannelPasswordValues): void => {
    submitPassword(
      { channelId, password: values.password },
      {
        onSuccess: () => {
          passwordError.current = 0;
        },
        onError: (err: unknown) => {
          // console.log({ err });
          if (isAxiosError(err) && err.response?.status === 401) {
            // console.log(passwordError.current);
            if (++passwordError.current > 2) {
              toast.error(
                'Are you sure you belong here? Go look somewhere else ;)'
              );
              void router.push('/chat');
            }
          }
        },
      }
    );
  };

  const hasJoined: boolean = React.useMemo(
    () =>
      !!me &&
      !!channel &&
      !!channel.users.find((user) => user.userId === me.id),
    [me, channel]
  );
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

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    if (me && channel && !hasJoined && !channel.isProtected) {
      timer = setTimeout(() => joinChannel({ channelId }), 100);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [me, channel, hasJoined, channelId, joinChannel]);

  if (!me || channelLoading) {
    return <ChatLayout title="Channel" screen="create" loading />;
  }
  if (channelError)
    return (
      <ChatLayout title="Channel" screen="create">
        <h1 className="flex items-center justify-center h-full w-full">
          Error
        </h1>
      </ChatLayout>
    );

  if (!hasJoined) {
    if (channel.isProtected) {
      return (
        <ChatLayout
          title={titles.title}
          screen="create"
          topRight={{
            href: `/chat/channel/${channelId}/settings`,
          }}
          channel={channel}
        >
          <ChannelPassword
            onSubmit={handlePasswordSubmit}
            initialValues={{ password: '' }}
          />
        </ChatLayout>
      );
    } else {
      return <ChatLayout title="Channel" screen="create" loading />;
    }
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
        <MessageList channelId={channelId} user={me} />
        <MessageInput channelId={channelId} />
      </div>
    </ChatLayout>
  );
}

export default ChannelContent;
