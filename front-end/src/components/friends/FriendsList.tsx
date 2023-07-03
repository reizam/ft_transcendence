import { IUserDataSummary } from '@/api/friends/friends.types';
import Line from '@/components/friends/line/Line';
import friendsStyles from '@/styles/friends.module.css';
import { ReactElement } from 'react';

interface UsersListProps {
  users: IUserDataSummary[];
  isFriend: boolean;
}

function UsersList({ users: users, isFriend }: UsersListProps): ReactElement {
  if (isFriend)
    return (
      <div className={friendsStyles.ctn__pre__friends}>
        <div className={friendsStyles.ctn__pre__friends__canvas}>
          <>
            <div className={friendsStyles.canvas__title}>
              <h2>Friends</h2>
            </div>
            {users?.map((user) => (
              <Line key={user.id} user={user} isFriend={isFriend} />
            ))}
          </>
        </div>
      </div>
    );
  else
    return (
      <div className={friendsStyles.ctn__pre__notfriends}>
        <div className={friendsStyles.ctn__pre__friends__canvas}>
          <>
            <div className={friendsStyles.canvas__title}>
              <h2>The Rest of the World</h2>
            </div>
            {users?.map((user) => (
              <Line key={user.id} user={user} isFriend={isFriend} />
            ))}
          </>
        </div>
      </div>
    );
}

export default UsersList;
