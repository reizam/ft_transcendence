/* eslint-disable react/no-unescaped-entities */
import {
  useChannelGet,
  useChannelPut,
  useLeaveChannelDelete,
} from '@/api/channel/channel.api';
import EditChannelForm, {
  EditChannelFormValues,
} from '@/components/chat/forms/EditChannelForm';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import { useAuth } from '@/providers/auth/auth.context';
import { generateChannelTitles, isAdmin } from '@/utils/channel.util';
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

  const { data: channel, isLoading } = useChannelGet(channelId, {
    enabled: isNaN(channelId) === false && channelId !== null,
  });

  const { mutate: leaveChannel, isLoading: leaving } = useLeaveChannelDelete({
    onSuccess: () => {
      void router.push('/chat');
    },
  });

  const { mutate: updateChannel, isLoading: editing } = useChannelPut({
    onSuccess: () => {
      void router.push(`/chat/channel/${channelId}`, undefined, {
        shallow: true,
      });
    },
    onError: () => {
      toast.error('Une erreur est survenue lors de la mise à jour du salon.');
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
    if (confirm('Êtes-vous sûr de vouloir quitter ce salon ?')) {
      leaveChannel(channelId);
    }
  };

  if (isLoading || !channel) {
    return <ChatLayout title="Salon" screen="create" loading />;
  }

  if (!user || !isAdmin(user.id, channel)) {
    return (
      <ChatLayout
        title="Salon"
        screen="create"
        topRight={{
          icon: <AiOutlineCloseCircle size={16} />,
          href: `/chat/channel/${channelId}`,
        }}
      >
        <div className="flex flex-col items-center justify-between h-full px-4 py-8">
          <h1 className="text-sm font-bold text-center">
            Vous n'avez pas les droits pour modifier ce salon.
          </h1>
          <div className="flex flex-row space-x-4">
            <button
              onClick={onLeave}
              className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
            >
              Quitter le salon
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
          password: '',
          withPassword: channel.isProtected,
        }}
      />
    </ChatLayout>
  );
}

export default ChannelSettingsContent;
