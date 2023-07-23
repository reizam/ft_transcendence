/* eslint-disable react/no-unescaped-entities */
import {
  useChannelGet,
  useChannelPut,
  useLeaveChannelDelete,
} from '@/api/channel/channel.api';
import { IChannel } from '@/api/channel/channel.types';
import EditChannelForm, {
  EditChannelFormValues,
} from '@/components/chat/forms/EditChannelForm';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import { useAuth } from '@/providers/auth/auth.context';
import { generateChannelTitles, isAdmin } from '@/utils/channel.util';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';

interface ChannelSettingsContentProps {
  channelId: number;
}

function ChannelSettingsContent({
  channelId,
}: ChannelSettingsContentProps): React.ReactElement {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: channel, isLoading } = useChannelGet(channelId, {
    enabled: isNaN(channelId) === false && channelId !== null,
  });

  const { mutate: leaveChannel, isLoading: leaving } = useLeaveChannelDelete({
    onSuccess: () => {
      void queryClient.invalidateQueries(['CHANNEL', 'GET', channelId]);
      void router.push('/chat');
    },
  });

  const { mutate: updateChannel, isLoading: editing } = useChannelPut({
    onMutate: () => {
      void router.push(`/chat/channel/${channelId}`, undefined, {
        shallow: true,
      });
    },
    onSuccess: (data: boolean) => {
      data ? toast.info('Updated', { autoClose: 1000 }) : null;
    },
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

  const onSubmit = (values: EditChannelFormValues): void => {
    updateChannel({
      channelId,
      password: values.withPassword ? values.password : undefined,
      withPassword: values.withPassword,
    });
  };

  const onLeave = (): void => {
    if (confirm('Do you really want to leave this channel?')) {
      leaveChannel(channelId);
    }
  };

  const isOwner = (userId: number, channel: IChannel): boolean =>
    userId === channel.ownerId;

  if (isLoading || !channel) {
    return <ChatLayout title="Channel" screen="create" loading />;
  }

  if (!user) {
    return (
      <ChatLayout
        title="Channel"
        screen="create"
        topRight={{
          icon: <AiOutlineCloseCircle size={16} />,
          href: `/chat/channel/${channelId}`,
        }}
      >
        <div className="flex flex-col items-center justify-between h-full px-4 py-8">
          <h1 className="text-sm font-bold text-center">
            You don't have the rights to edit this channel
          </h1>
          <div className="flex flex-row space-x-4">
            <button
              onClick={onLeave}
              className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
            >
              Leave channel
            </button>
          </div>
        </div>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout
      loading={leaving || editing}
      title={titles.title}
      screen="create"
      topRight={{
        icon: <AiOutlineCloseCircle size={16} />,
        href: `/chat/channel/${channelId}`,
      }}
    >
      <EditChannelForm
        onLeave={onLeave}
        onSubmit={onSubmit}
        initialValues={{
          channel,
          isOwner: isOwner(user.id, channel),
          isAdmin: isAdmin(user.id, channel),
          users: channel.users,
          withPassword: channel.isProtected,
          password: '',
        }}
      />
    </ChatLayout>
  );
}

export default ChannelSettingsContent;
