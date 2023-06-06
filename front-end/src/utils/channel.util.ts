import { IChannel } from '@/api/channel/channel.types';
import { generateAcronymFromList } from '@/utils/string.util';

export const isAdmin = (userId: number, channel: IChannel): boolean =>
  channel.ownerId === userId ||
  channel.users.some((u) => u.userId === userId && u.admin);

export const generateChannelTitles = (
  channel: IChannel
): {
  title: string;
  acronym: string;
} => {
  const users: string[] = [];

  users.push(
    channel.owner.username ||
      `${channel.owner.firstName} ${channel.owner.lastName}`
  );

  users.push(
    ...channel.users.map(
      ({ user }) => user.username || `${user.firstName} ${user.lastName}`
    )
  );

  return {
    title: channel.private
      ? `Salon privé - ${users.join(', ')}`
      : users.join(', '),
    acronym: generateAcronymFromList(users),
  };
};
