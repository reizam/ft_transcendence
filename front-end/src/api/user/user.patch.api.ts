import { updateWithToken } from '@/api';
import { IUpdateProfile, IUserData } from '@/api/user/user.type';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Id, toast } from 'react-toastify';

interface IContext {
  data?: IUserData;
  id: Id;
}

export const useUpdateMe = (): UseMutationResult<
  unknown,
  unknown,
  IUpdateProfile,
  IContext
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: IUpdateProfile) => {
      const data = await updateWithToken('/profile', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    },
    onMutate: async (newData: IUpdateProfile) => {
      const id = toast.loading('Updating');
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
      return { previousData, id };
    },
    onSuccess: (data: unknown, variables: unknown, context): void => {
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
    onError: (err, _data, context) => {
      console.error(err);
      if (context !== undefined) {
        toast.update(context.id, {
          render: 'Failed to update',
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
