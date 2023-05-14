import { useQuery } from '@tanstack/react-query';
import { getWithToken } from '..';
import { IUserData } from './user.type';

export const useGetMe = () =>
  useQuery<IUserData, any>(['PROFILE', 'GET'], async (): Promise<IUserData> => {
    const data = await getWithToken('/profile');

    return data as IUserData;
  });

export const useGetUser = (id?: string) =>
  useQuery<IUserData, any>(
    ['PROFILE', 'GET', id],
    async (): Promise<IUserData> => {
      const data = await getWithToken(`/profile/${id}`);

      return data as IUserData;
    },
    { enabled: !!id }
  );
