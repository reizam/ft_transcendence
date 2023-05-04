import { getWithToken } from '@/api';
import { IUserData } from '@/api/user/user.type';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

const onError = (err: Error): void => {
  console.error(err);
};

const onSuccess = (data: IUserData): void => {
  console.log(data);
};

export const useGetMe = (): UseQueryResult<IUserData, Error> =>
  useQuery(
    ['PROFILE', 'GET'],
    async () => {
      const data = await getWithToken('/profile');

      return data;
    },
    { onError, onSuccess }
  );

export const useGetUser = (id?: string): UseQueryResult<IUserData, Error> =>
  useQuery(
    ['PROFILE', 'GET', id],
    async () => {
      const data = await getWithToken(`/profile/${id}`);

      return data;
    },
    { enabled: !!id, onError, onSuccess }
  );
