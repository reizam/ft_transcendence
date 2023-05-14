import React from 'react';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import ChannelForm from '@/components/chat/forms/ChannelForm';

function CreateChannelContent(): React.ReactElement {
  return (
    <ChatLayout title="Créer un salon" screen="create">
      <ChannelForm
        onSubmit={(): void => {
          console.log('submit');
        }}
        buttonLabel="Créer le salon"
        initialValues={{
          password: '',
          private: false,
          users: [],
        }}
      />
    </ChatLayout>
  );
}

export default CreateChannelContent;
