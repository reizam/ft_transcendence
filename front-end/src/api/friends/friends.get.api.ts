import { getWithToken } from '@/api';
import { IUserFriends } from '@/api/friends/friends.types';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const onFetchError = (err: Error): void => {
  console.error(err);
  toast.error('Failed to fetch');
};

const onFetchSuccess = (data: IUserFriends): void => {
  void data;
  // console.log(data);
};

const defaultUserFetchConfig = {
  refetchOnWindowFocus: false,
  onError: onFetchError,
  onSuccess: onFetchSuccess,
};

export const useGetFriends = (): UseQueryResult<IUserFriends, Error> =>
  useQuery(
    ['FRIENDS', 'GET', 'ME'],
    async () => {
      const data = await getWithToken('/friends');
      // console.log(data);
      return data;
    },
    { ...defaultUserFetchConfig }
  );
