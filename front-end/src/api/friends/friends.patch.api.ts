import { updateWithToken } from '@/api';
import { UpdateFriendsList } from '@/api/friends/friends.types';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
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
    onError: (err: unknown, _var: unknown, context?: Id) => {
      context
        ? toast.update(context, {
            render: printFriendsError(err),
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

export const printFriendsError = (error: unknown): string => {
  let errorMessage = 'Failed to update';
  if (
    axios.isAxiosError(error) &&
    error.response?.data &&
    'message' in error.response.data
  ) {
    if (Array.isArray(error?.response?.data?.message)) {
      errorMessage = error.response.data.message[0];
    } else if (typeof error?.response?.data?.message === 'string') {
      errorMessage = error.response.data.message;
    }
  } else if (error instanceof Error && error.message) {
    errorMessage = error.message;
  }
  return errorMessage;
};
