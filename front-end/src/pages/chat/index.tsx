import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/app/layouts/Layout';
import ChatContent from '@/components/chat/ChatContent';
import { withProtected } from '@/providers/auth/auth.routes';

const Chat: NextPage = () => {
  return (
    <Layout title="Chat">
      <ChatContent />
    </Layout>
  );
};

export default withProtected(Chat);
