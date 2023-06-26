import { updateWithToken } from '@/api';
import { IUserData, UpdateProfile } from '@/api/user/user.types';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createElement } from 'react';
import { Id, toast } from 'react-toastify';

interface IMutationResult {
  qrCodeDataUrl: string | undefined;
}

interface IContext {
  previousData?: IUserData;
  id: Id;
}

export const useBlockUser = (): UseMutationResult<
  unknown,
  unknown,
  { id: number; toggleBlock: boolean },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { id: number; toggleBlock: boolean }) => {
      const data = await updateWithToken('/channel/block', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    },
    onSettled: () => {
      void queryClient.invalidateQueries(['PROFILE', 'GET', 'ME']);
    },
  });
};

export const useUpdateMe = (): UseMutationResult<
  IMutationResult,
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
      return data as IMutationResult;
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
      data: IMutationResult,
      _variables: unknown,
      context?: IContext
    ): void => {
      if (context !== undefined) {
        if (!data) toast.dismiss('qrCodeToast');
        toast.update(context.id, {
          render: data
            ? createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                  },
                },
                createElement('img', {
                  src: data.qrCodeDataUrl,
                  alt: 'Scan this QR code with your 2FA app',
                }),
                createElement(
                  'p',
                  {},
                  'Scan this QR code with your 2FA app before leaving,',
                  " or you won't be able to log in anymore!"
                )
              )
            : 'Updated',
          type: 'success',
          autoClose: data ? false : 1000,
          closeButton: data ? true : false,
          isLoading: false,
          toastId: data ? 'qrCodeToast' : context.id,
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
