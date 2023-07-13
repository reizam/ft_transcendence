import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/app/layouts/Layout';
import { withProtected } from '@/providers/auth/auth.routes';
import { useRouter } from 'next/router';
import ChannelSettingsContent from '@/components/chat/channel/ChannelSettingsContent';

const ChannelSettings: NextPage = () => {
  const router = useRouter();

  const channelId = Number(router.query.id);

  return (
    <Layout title="Salon">
      <ChannelSettingsContent channelId={channelId} />
    </Layout>
  );
};

export default withProtected(ChannelSettings);
