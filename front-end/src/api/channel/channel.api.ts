/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getWithToken, postWithToken, putWithToken } from '@/api';
import {
  IChannel,
  IChannelPage,
  IChannelPostParams,
  IChannelPutParams,
  IChannelSendMessagePostParams,
  IMessage,
  IMessagePage,
} from '@/api/channel/channel.types';
import {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

export const useInfiniteChannelsGet = (
  limit: number,
  options?: UseInfiniteQueryOptions<IChannelPage, unknown>
) =>
  useInfiniteQuery<IChannelPage, unknown>(
    ['CHANNELS', 'GET'],
    async ({ pageParam = 0 }): Promise<IChannelPage> => {
      const data = await getWithToken(`/channel/page`, {
        params: {
          limit,
          page: pageParam,
        },
      });

      return data as IChannelPage;
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
  options?: UseQueryOptions<IChannel, unknown>
) =>
  useQuery<IChannel, unknown>(
    ['CHANNEL', 'GET', channelId],
    async () => {
      const data = await getWithToken(`/channel`, {
        params: {
          channelId,
        },
      });

      return data as IChannel;
    },
    options
  );

export const useChannelPut = (
  options?: UseMutationOptions<void, unknown, IChannelPutParams>
) =>
  useMutation<void, unknown, IChannelPutParams>(async (params) => {
    await putWithToken(`/channel`, params);
  }, options);

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
) =>
  useInfiniteQuery<IMessagePage, unknown>(
    ['CHANNEL_MESSAGES', 'GET', channelId],
    async ({ pageParam = 0 }): Promise<IMessagePage> => {
      const data = await getWithToken('/channel/message/page', {
        params: {
          channelId,
          limit,
          page: pageParam,
        },
      });

      return data as IMessagePage;
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
      ...options,
    }
  );

export const useSendMessagePost = (
  options?: UseMutationOptions<IMessage, unknown, IChannelSendMessagePostParams>
) =>
  useMutation<IMessage, unknown, IChannelSendMessagePostParams>(
    async (params): Promise<IMessage> => {
      const data = await postWithToken('/channel/message', params);

      return data as IMessage;
    },
    options
  );

export const useChannelPost = (
  options?: UseMutationOptions<IChannel, unknown, IChannelPostParams>
) =>
  useMutation<IChannel, unknown, IChannelPostParams>(
    async (params): Promise<IChannel> => {
      const data = await postWithToken('/channel', params);

      return data as IChannel;
    },
    options
  );
