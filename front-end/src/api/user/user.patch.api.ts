import { updateWithToken } from '@/api';
import { UpdateProfile, IUserData } from '@/api/user/user.type';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Id, toast } from 'react-toastify';

interface IContext {
  previousData?: IUserData;
  id: Id;
}

export const useUpdateMe = (): UseMutationResult<
  unknown,
  unknown,
  UpdateProfile,
  IContext
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateProfile) => {
      const data = await updateWithToken('/profile', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    },
    onMutate: async (newData: UpdateProfile) => {
      await queryClient.cancelQueries(['PROFILE', 'GET', 'ME']);
      const previousData = queryClient.getQueryData<IUserData>([
        'PROFILE',
        'GET',
        'ME',
      ]);
      if (previousData) {
        queryClient.setQueryData<IUserData>(['PROFILE', 'GET', 'ME'], {
          ...previousData,
          ...newData,
        });
      }
      const id = toast.loading('Updating');
      return { previousData, id };
    },
    onSuccess: (
      data: unknown,
      variables: unknown,
      context?: IContext
    ): void => {
      console.log('Data: ', data);
      console.log('Variables: ', variables);
      console.log('context: ', context);
      if (context !== undefined) {
        toast.update(context.id, {
          render: 'Updated',
          type: 'success',
          autoClose: 1000,
          isLoading: false,
        });
      } else {
        toast.dismiss();
      }
    },
    onError: (err: unknown, _data: UpdateProfile, context?: IContext) => {
      if (context !== undefined) {
        toast.update(context.id, {
          render: `${
            ((err as AxiosError)?.response?.data as any)?.message ??
            'Failed to update'
          }`,
          type: 'error',
          autoClose: 2000,
          isLoading: false,
        });
      } else {
        toast.dismiss();
      }
      if (context?.previousData) {
        queryClient.setQueryData<IUserData>(
          ['PROFILE', 'GET', 'ME'],
          context.previousData
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries(['PROFILE', 'GET', 'ME']);
    },
  });
};
