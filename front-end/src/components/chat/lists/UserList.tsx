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
  users: IChannelUser[];
  // onSubmit: (values: EditAdminList) => void;
}

function UserList({ owner, users }: UserListProps): React.ReactElement {
  const admins = users.filter((item) => item.admin).map((item) => item.user);
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
          {admins.map((user) => (
            <ChannelUserItem key={user.user.id} channelUser={user} />
          ))}
        </div>
      </div>
      <div className="relative flex flex-col space-y-4 rounded-lg p-4 w-full">
        <div className="flex flex-row items-start flex-wrap gap-1 w-full overflow-y-auto">
          {users.map((user) => (
            <ChannelUserItem key={user.user.id} channelUser={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserList;
