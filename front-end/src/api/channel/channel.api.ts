/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getWithToken, postWithToken } from '@/api';
import {
  IChannel,
  IChannelPage,
  IChannelPostParams,
} from '@/api/channel/channel.types';
import {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';

export const useInfiniteChannelsGet = (
  limit: number,
  options?: UseInfiniteQueryOptions<IChannelPage, unknown>
) =>
  useInfiniteQuery<IChannelPage, unknown>(
    ['CHANNELS', 'GET'],
    async ({ pageParam = 0 }): Promise<IChannelPage> => {
      const data = await getWithToken(`/channel`, {
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
