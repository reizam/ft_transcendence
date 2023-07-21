import { IChannelUser } from '@/api/channel/channel.types';
import ChannelUserItem from '@/components/chat/items/ChannelUserItem';
import Link from 'next/link';

// const schema = Yup.object().shape({
//   admins: Yup.array().of(Yup.number()).required(),
// });

// export type EditAdminList = {
//   admins: number[];
// };

interface UserListProps {
  owner?: IChannelUser;
  admins?: IChannelUser[];
  users: IChannelUser[];
  // onSubmit: (values: EditAdminList) => void;
}

function UserList({ owner, admins, users }: UserListProps): React.ReactElement {
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="relative flex flex-col space-y-4 bg-purple/25 rounded-lg p-4 w-full">
        <p className="text-s">Owner</p>
        <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
          {owner && (
            <Link href={`/profile/${owner.userId}`}>
              <ChannelUserItem
                key={`${'owner' + owner.userId}`}
                channelUser={owner}
              />
            </Link>
          )}
        </div>
      </div>
      <div className="relative flex flex-col space-y-4 bg-purple/10 rounded-lg p-4 w-full">
        <p className="text-s">Admins</p>
        <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
          {admins &&
            admins.map((admin) => (
              <Link href={`/profile/${admin.userId}`}>
                <ChannelUserItem
                  key={`${'admin' + admin.userId}`}
                  channelUser={admin}
                />
              </Link>
            ))}
        </div>
      </div>
      <div className="relative flex flex-col space-y-4 rounded-lg p-4 w-full">
        <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
          {users
            .filter((user) => !user.isAdmin)
            .map((user) => (
              <Link href={`/profile/${user.userId}`}>
                <ChannelUserItem key={user.userId} channelUser={user} />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserList;
