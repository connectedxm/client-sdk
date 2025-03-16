import { ChannelSubscriber } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_QUERY_KEY } from "./useGetManagedChannel";

export const MANAGED_CHANNEL_SUBSCRIBERS_QUERY_KEY = (
  channelId: string
): QueryKey => [...MANAGED_CHANNEL_QUERY_KEY(channelId), "SUBSCRIBERS"];

export interface GetManagedChannelSubscribersParams
  extends InfiniteQueryParams {
  channelId: string;
}

export const GetManagedChannelSubscribers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  clientApiParams,
}: GetManagedChannelSubscribersParams): Promise<
  ConnectedXMResponse<ChannelSubscriber[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/subscribers`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  return data;
};

export const useGetManagedChannelSubscribers = (
  channelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelSubscribers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelSubscribers>>
  >(
    MANAGED_CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelSubscribers({ ...params, channelId: channelId || "" }),
    params,
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
