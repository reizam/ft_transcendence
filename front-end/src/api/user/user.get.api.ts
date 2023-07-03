import { getWithToken } from '@/api';
import { IUserData } from '@/api/user/user.types';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';

const onFetchError = (err: Error): void => {
  console.error(err);
  toast.error('Failed to fetch');
};

const onFetchSuccess = (data: IUserData): void => {
  console.log(data);
};

const defaultUserFetchConfig = {
  refetchOnWindowFocus: false,
  onError: onFetchError,
  onSuccess: onFetchSuccess,
};

export const useGetMe = (
  additionalQueryId: string[] = [],
  options: UseQueryOptions<IUserData, Error> = {}
): UseQueryResult<IUserData, Error> =>
  useQuery<IUserData, Error>(
    ['PROFILE', 'GET', 'ME', ...additionalQueryId],
    async () => {
      const data = await getWithToken('/profile');

      return data as IUserData;
    },
    { ...defaultUserFetchConfig, ...options }
  );

export const useGetUser = (id?: string): UseQueryResult<IUserData, Error> =>
  useQuery(
    ['PROFILE', 'GET', id],
    async () => {
      const data = await getWithToken(`/profile/${id}`);

      return data as IUserData;
    },
    { ...defaultUserFetchConfig, enabled: !!id }
  );

  export const useGetFriends = (): UseQueryResult<IUserData, Error> =>
  useQuery(
    ['FRIENDS', 'GET'],
    async () => {
      const data = await getWithToken('/friends');
      console.log(data);
      return data;
    },
    { ...defaultUserFetchConfig }
  );