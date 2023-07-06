import { updateWithToken } from '@/api';
import { UpdateFriendsList } from '@/api/friends/friends.types';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Id, toast } from 'react-toastify';

export const useUpdateFriends = (): UseMutationResult<
  unknown,
  unknown,
  UpdateFriendsList,
  unknown
> => {
  const queryClient = useQueryClient();
  const toastUpdateOptions = {
    autoClose: 1000,
    isLoading: false,
  };

  return useMutation({
    mutationFn: async (body: UpdateFriendsList) => {
      const data = await updateWithToken('/friends', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    },
    onMutate: () => toast.loading('Updating'),
    onSuccess: (_data: unknown, _var: unknown, context?: Id) => {
      context
        ? toast.update(context, {
            render: 'Updated',
            type: 'success',
            ...toastUpdateOptions,
          })
        : toast.dismiss();
    },
    onError: (_data: unknown, _var: unknown, context?: Id) => {
      context
        ? toast.update(context, {
            render: 'Failed to update',
            type: 'error',
            ...toastUpdateOptions,
          })
        : toast.dismiss();
    },
    onSettled: () => {
      void queryClient.invalidateQueries(['FRIENDS', 'GET', 'ME']);
    },
  });
};
