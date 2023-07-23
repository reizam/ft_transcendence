/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  getWithToken,
  postWithToken,
  putWithToken,
  updateWithToken,
} from '@/api';
import {
  IChannel,
  IChannelJoinParams,
  IChannelPage,
  IChannelPostParams,
  IChannelPutParams,
  IChannelUpdateParams,
  IChatUser,
  IJoinDMParams,
  IMessage,
  IMessagePage,
  IMessagePost,
} from '@/api/channel/channel.types';
import {
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { Id, toast } from 'react-toastify';

const onFetchError = (err: Error): void => {
  toast.error(printChannelError(err));
};

const onFetchSuccess = (data: unknown): void => {
  console.log(data);
};

const defaultChannelFetchConfig = {
  refetchOnWindowFocus: false,
  onError: onFetchError,
  onSuccess: onFetchSuccess,
};

export const useInfiniteChannelsGet = (
  limit: number,
  options?: UseInfiniteQueryOptions<IChannelPage, unknown>
) =>
  useInfiniteQuery<IChannelPage, unknown>(
    ['CHANNELS', 'GET'],
    async ({ pageParam = 0 }): Promise<IChannelPage> => {
      const data = await getWithToken<IChannelPage>(`/channel/page`, {
        params: {
          limit,
          page: pageParam,
        },
      });

      return data;
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.hasNextPage) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      ...options,
    }
  );

export const useChannelGet = (
  channelId: number,
  options: UseQueryOptions<IChannel, Error>
): UseQueryResult<IChannel, Error> =>
  useQuery<IChannel, Error>(
    ['CHANNEL', 'GET', channelId],
    async () => {
      const data = await getWithToken<IChannel>(`/channel`, {
        params: {
          channelId,
        },
      });

      return data;
    },
    { ...defaultChannelFetchConfig, ...options }
  );

export const useChannelPut = (
  options?: UseMutationOptions<boolean, unknown, IChannelPutParams>
) => {
  return useMutation({
    mutationFn: async (params: IChannelPutParams) => {
      return await putWithToken<boolean>(`/channel`, params);
    },
    onError: (err: unknown) => {
      toast.error(printChannelError(err));
    },
    ...options,
  });
};

export const useLeaveChannelDelete = (
  options?: UseMutationOptions<void, unknown, number>
) =>
  useMutation<void, unknown, number>(async (channelId) => {
    await postWithToken(
      `/channel/leave`,
      {},
      {
        params: {
          channelId,
        },
      }
    );
  }, options);

export const useChannelMessagesGet = (
  channelId: number,
  limit: number,
  options?: UseInfiniteQueryOptions<IMessagePage, unknown>
) => {
  const queryClient = useQueryClient();
  return useInfiniteQuery<IMessagePage, unknown>(
    ['CHANNEL_MESSAGES', 'GET', channelId],
    async ({ pageParam = 0 }): Promise<IMessagePage> => {
      const data = await getWithToken<IMessagePage>('/channel/message/page', {
        params: {
          channelId,
          limit,
          page: pageParam,
        },
      });

      return data;
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
      onSettled: () => {
        void queryClient.invalidateQueries(['CHANNELS', 'GET']);
      },
      ...options,
    }
  );
};

export const useSendMessagePost = (
  channelId: number
): UseMutationResult<IMessage, unknown, IMessagePost, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: IMessagePost) => {
      const data = await postWithToken<IMessage>('/channel/message', body);

      return data;
    },
    onError: (err: unknown) => {
      toast.error(printChannelError(err));
    },
    onSuccess: () => {
      const queryKey: QueryKey = ['CHANNEL_MESSAGES', 'GET', channelId];
      if (!queryClient.isFetching({ queryKey }))
        void queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useChannelPost = (
  options?: UseMutationOptions<IChannel, unknown, IChannelPostParams>
) =>
  useMutation<IChannel, unknown, IChannelPostParams>(
    async (params): Promise<IChannel> => {
      const data = await postWithToken<IChannel>('/channel', params);

      return data;
    },
    options
  );

export const useGetAllChatUsers = (
  channelId: number,
  options: UseQueryOptions<IChatUser[], Error>
): UseQueryResult<IChatUser[], Error> =>
  useQuery<IChatUser[], Error>(
    ['CHAT', 'GET', 'USER', 'ALL'],
    async () => {
      const users = await getWithToken<IChatUser[]>(`/channel/allChatUsers`, {
        params: {
          channelId,
        },
      });

      return users;
    },
    { ...options }
  );

export const useChannelUpdate = (
  options?: UseMutationOptions<
    unknown,
    unknown,
    IChannelUpdateParams,
    Id | void
  >
) => {
  const queryClient = useQueryClient();
  const toastUpdateOptions = {
    autoClose: 1000,
    isLoading: false,
  };

  return useMutation({
    mutationFn: async (params: IChannelUpdateParams) => {
      const data = await updateWithToken('/channel/sanction', params);
      console.log({ data });
      return data;
    },
    onMutate: () => toast.loading('Updating'),
    onSuccess: (
      _data: unknown,
      _var: IChannelUpdateParams,
      context?: Id | void
    ) => {
      context
        ? toast.update(context, {
            render: 'Updated',
            type: 'success',
            ...toastUpdateOptions,
          })
        : toast.dismiss();
    },
    onError: (err: unknown, _var: unknown, context?: Id | void) => {
      context
        ? toast.update(context, {
            render: printChannelError(err),
            type: 'error',
            ...toastUpdateOptions,
          })
        : toast.dismiss();
    },
    onSettled: (_data, _err, params: IChannelUpdateParams) => {
      void queryClient.invalidateQueries(['CHANNEL', 'GET', params.channelId]);
    },
    ...options,
  });
};

export const useChannelJoin = (
  options?: UseMutationOptions<IChannel, unknown, IChannelJoinParams, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: IChannelJoinParams) => {
      const data = await postWithToken<IChannel>('/channel/join', params);
      return data;
    },
    onSuccess: (data: IChannel, params: IChannelJoinParams) => {
      void queryClient.invalidateQueries(['CHANNELS', 'GET']);
      void queryClient.invalidateQueries(['CHANNEL', 'GET', params.channelId]);
    },
    onError: (err: unknown) => {
      toast.error(printChannelError(err));
    },
    ...options,
  });
};

export const useDMJoin = (
  options?: UseMutationOptions<IChannel, unknown, IJoinDMParams, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: IJoinDMParams) => {
      const data = await postWithToken<IChannel>('/channel/joinDM', params);
      return data;
    },
    onSuccess: (data: IChannel) => {
      void queryClient.invalidateQueries(['CHANNELS', 'GET']);
      void queryClient.invalidateQueries(['CHANNEL', 'GET', data.id]);
    },
    onError: (err: unknown) => {
      toast.error(printChannelError(err));
    },
    ...options,
  });
};

export const printChannelError = (error: unknown): string => {
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
