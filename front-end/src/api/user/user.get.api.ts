import { getWithToken } from '@/api';
import { IUserData } from '@/api/user/user.type';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
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

export const useGetMe = (): UseQueryResult<IUserData, Error> =>
  useQuery(
    ['PROFILE', 'GET', 'ME'],
    async () => {
      const data = await getWithToken('/profile');

      return data;
    },
    { ...defaultUserFetchConfig }
  );

export const useGetUser = (id?: string): UseQueryResult<IUserData, Error> =>
  useQuery(
    ['PROFILE', 'GET', id],
    async () => {
      const data = await getWithToken(`/profile/${id}`);

      return data;
    },
    { ...defaultUserFetchConfig, enabled: !!id }
  );
