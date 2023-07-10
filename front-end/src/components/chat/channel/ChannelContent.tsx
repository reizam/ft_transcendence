import { postWithToken } from '@/api';
import { useChannelGet } from '@/api/channel/channel.api';
import { useGetMe } from '@/api/user/user.get.api';
import ChannelPassword, {
  ChannelPasswordValues,
} from '@/components/chat/forms/ChannelPassword';
import MessageInput from '@/components/chat/inputs/MessageInput';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import MessageList from '@/components/chat/lists/MessageList';
import { generateChannelTitles } from '@/utils/channel.util';
import React from 'react';

interface ChannelContentProps {
  channelId: number;
}

// TODO: refetch on event 'newMessage'
function ChannelContent({
  channelId,
}: ChannelContentProps): React.ReactElement {
  const {
    data: me,
    isLoading: userLoading,
    isError: userError,
  } = useGetMe(undefined, {
    refetchOnWindowFocus: true,
  });

  const {
    data: channel,
    isLoading: channelLoading,
    isError: channelError,
  } = useChannelGet(channelId, {
    enabled: isNaN(channelId) === false && channelId !== null,
  });

  // const hasJoined = React.useMemo(() => )

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

  if (channelLoading || userLoading) {
    return <ChatLayout title="Salon" screen="create" loading />;
  }

  if (userError || channelError)
    return (
      <ChatLayout title="Salon" screen="create">
        <h1>Error</h1>
      </ChatLayout>
    );

  if (!channel) {
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
          onSubmit={async (values: ChannelPasswordValues): Promise<void> => {
            await postWithToken('/channel/join', {
              channelId,
              password: values.password,
            });
          }}
          initialValues={{ password: '' }}
        />
      </ChatLayout>
    );
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
