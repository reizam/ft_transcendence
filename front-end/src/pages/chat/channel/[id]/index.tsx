import Layout from '@/components/app/layouts/Layout';
import ChannelContent from '@/components/chat/channel/ChannelContent';
import { withProtected } from '@/providers/auth/auth.routes';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Channel: NextPage = () => {
  const router = useRouter();

  const channelId = Number(router.query.id);

  return (
    <Layout title="Salon">
      <ChannelContent channelId={channelId} />
    </Layout>
  );
};

export default withProtected(Channel);
