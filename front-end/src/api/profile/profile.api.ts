import { useQuery } from '@tanstack/react-query';
import { getWithToken } from '..';
import { IUserData } from './profile.type';

export const useGetMe = () =>
  useQuery<IUserData, any>(['PROFILE', 'GET'], async () => {
    const data = await getWithToken('/profile');

    return data;
  });

export const useGetUser = (id?: string) =>
  useQuery<IUserData, any>(
    ['PROFILE', 'GET', id],
    async () => {
      const data = await getWithToken(`/profile/${id}`);

      return data;
    },
    { enabled: !!id }
  );
