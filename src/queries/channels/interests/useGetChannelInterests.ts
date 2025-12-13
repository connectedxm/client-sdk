import { Interest } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_QUERY_KEY } from "../useGetChannel";

export const CHANNEL_INTERESTS_QUERY_KEY = (channelId: string): QueryKey => [
  ...CHANNEL_QUERY_KEY(channelId),
  "INTERESTS",
];

export interface GetChannelInterestsParams extends InfiniteQueryParams {
  channelId: string;
}

export const GetChannelInterests = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChannelInterestsParams): Promise<ConnectedXMResponse<Interest[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/${channelId}/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetChannelInterests = (
  channelId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelInterests>>
  >(
    CHANNEL_INTERESTS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetChannelInterests({ channelId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
