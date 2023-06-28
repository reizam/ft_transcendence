import { IChannelUser } from '@/api/channel/channel.types';
import ChannelUserItem from '@/components/chat/items/ChannelUserItem';

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
          {owner && <ChannelUserItem key={owner.userId} channelUser={owner} />}
        </div>
      </div>
      <div className="relative flex flex-col space-y-4 bg-purple/10 rounded-lg p-4 w-full">
        <p className="text-s">Admins</p>
        <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
          {admins &&
            admins.map((admin) => (
              <ChannelUserItem key={admin.userId} channelUser={admin} />
            ))}
        </div>
      </div>
      <div className="relative flex flex-col space-y-4 rounded-lg p-4 w-full">
        <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
          {users
            .filter((user) => !user.admin)
            .map((user) => (
              <ChannelUserItem key={user.userId} channelUser={user} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserList;
