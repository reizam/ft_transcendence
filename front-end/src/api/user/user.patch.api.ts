import { updateWithToken } from '@/api';
import { IUpdateProfile } from '@/api/user/user.type';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { Id, toast } from 'react-toastify';

const onUpdate = () => {
  const id = toast.loading('Updating');
  return id;
};

const onUpdateError = (err: Error): void => {
  console.error(err);
  toast.error('Failed to update');
};

const onUpdateSuccess = (
  data: unknown,
  variables: unknown,
  context: unknown
): void => {
  console.log('Data: ', data);
  console.log('Variables: ', variables);
  console.log('context: ', context);
  toast.update(context as Id, {
    render: 'Updated',
    type: 'success',
    autoClose: 1000,
    isLoading: false,
  });
};

const defaultUserUpdateConfig = {
  onMutate: onUpdate,
  onError: onUpdateError,
  onSuccess: onUpdateSuccess,
};

export const useUpdateMe = (): UseMutationResult<
  unknown,
  unknown,
  IUpdateProfile,
  unknown
> =>
  useMutation({
    mutationFn: async (body: IUpdateProfile) => {
      const data = await updateWithToken('/profile', body, {
        headers: { 'Content-Type': 'application/json' },
      });

      return data;
    },
    ...defaultUserUpdateConfig,
  });
