import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/app/layouts/Layout';
import { withProtected } from '@/providers/auth/auth.routes';
import ChannelContent from '@/components/chat/channel/ChannelContent';

const CreateChannel: NextPage = () => {
  return (
    <Layout title="Salon">
      <ChannelContent />
    </Layout>
  );
};

export default withProtected(CreateChannel);
