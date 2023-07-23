import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/app/layouts/Layout';
import CreateChannelContent from '@/components/chat/create/CreateChannelContent';
import { withProtected } from '@/providers/auth/auth.routes';

const CreateChannel: NextPage = () => {
  return (
    <Layout title="Chat">
      <CreateChannelContent />
    </Layout>
  );
};

export default withProtected(CreateChannel);
