import { updateWithToken } from '@/api';
import { UpdateFriendsList } from '@/api/friends/friends.types';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const useUpdateFriends = (): UseMutationResult<
  unknown,
  unknown,
  UpdateFriendsList,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateFriendsList) => {
      const data = await updateWithToken('/friends', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    },
    onSettled: () => {
      void queryClient.invalidateQueries(['FRIENDS', 'GET']);
    },
  });
};
