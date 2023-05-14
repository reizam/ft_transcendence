import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/app/layouts/Layout';
import CreateChannelContent from '@/components/chat/create/CreateChannelContent';

const CreateChannel: NextPage = () => {
  return (
    <Layout title="Creer un salon">
      <CreateChannelContent />
    </Layout>
  );
};

export default CreateChannel;
