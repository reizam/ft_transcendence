import { IChannel } from '@/api/channel/channel.types';
import { generateAcronymFromList } from '@/utils/string.util';

export const isAdmin = (userId: number, channel: IChannel): boolean =>
  channel.ownerId === userId ||
  channel.users.some((u) => u.userId === userId && u.isAdmin);

export const generateChannelTitles = (
  channel: IChannel
): {
  title: string;
  acronym: string;
} => {
  const users: string[] = [];

  users.push(...channel.users.map(({ user }) => user.username));

  return {
    title: channel.isPrivate
      ? channel.isDM
        ? `DM (${channel.id}) - ${users.join(', ')}`
        : `Private (${channel.id}) - ${users.join(', ')}`
      : `Public (${channel.id}) - ${users.join(', ')}`,
    acronym: generateAcronymFromList(users),
  };
};
