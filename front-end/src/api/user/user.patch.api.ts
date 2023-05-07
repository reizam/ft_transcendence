import { updateWithToken } from '@/api';
import { IUpdateProfile } from '@/api/user/user.type';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { Id, toast } from 'react-toastify';

const onUpdate = (variables: IUpdateProfile): Id => {
  const id = toast.loading('Updating');
  return id;
};

const onUpdateError = (
  err: unknown,
  _variables: IUpdateProfile,
  context?: Id
): void => {
  context
    ? toast.update(context, {
        render: 'Failed to update',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      })
    : toast.dismiss();
};

const onUpdateSuccess = (
  _data: unknown,
  _variables: IUpdateProfile,
  context?: Id
): void => {
  context
    ? toast.update(context, {
        render: 'Updated',
        type: 'success',
        autoClose: 1000,
        isLoading: false,
      })
    : toast.dismiss();
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
  Id
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
