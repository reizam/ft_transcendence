import { updateWithToken } from '@/api';
import { IUserData, UpdateProfile } from '@/api/user/user.types';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
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
  const toastUpdateOptions = {
    autoClose: 1000,
    isLoading: false,
  };

  return useMutation({
    mutationFn: async (body: { id: number; toggleBlock: boolean }) => {
      const data = await updateWithToken('/channel/block', body, {
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
            render: printProfileError(err),
            type: 'error',
            ...toastUpdateOptions,
          })
        : toast.dismiss();
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
      const data = await updateWithToken<IMutationResult>('/profile', body, {
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
      data: IMutationResult,
      _variables: UpdateProfile,
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
    onError: (err: unknown, _variables: UpdateProfile, context?: IContext) => {
      if (context !== undefined) {
        toast.update(context.id, {
          render: printProfileError(err),
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

export const printProfileError = (error: unknown): string => {
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
