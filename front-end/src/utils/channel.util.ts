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

  users.push(channel.owner.username);

  users.push(
    ...channel.users
      .filter(({ user }) => user.username !== channel.owner.username)
      .map(({ user }) => user.username)
  );

  return {
    title: channel.isPrivate
      ? `Salon privé - ${users.join(', ')}`
      : users.join(', '),
    acronym: generateAcronymFromList(users),
  };
};
