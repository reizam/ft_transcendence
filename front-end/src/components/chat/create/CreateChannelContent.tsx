import React from 'react';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import ChannelForm, {
  ChannelFormValues,
} from '@/components/chat/forms/ChannelForm';
import { useChannelPost } from '@/api/channel/channel.api';
import { useRouter } from 'next/router';

function CreateChannelContent(): React.ReactElement {
  const router = useRouter();

  const { mutate: createChannel } = useChannelPost({
    onSuccess: () => {
      void router.push('/chat');
    },
  });

  const onSubmit = (values: ChannelFormValues): void => {
    createChannel({
      isPrivate: values.isPrivate,
      password: values.password || undefined,
      users: values.users,
    });
  };

  return (
    <ChatLayout title="Create a channel" screen="create">
      <ChannelForm
        onSubmit={onSubmit}
        buttonLabel="Create channel"
        initialValues={{
          password: '',
          isPrivate: false,
          users: [],
        }}
      />
    </ChatLayout>
  );
}

export default CreateChannelContent;
