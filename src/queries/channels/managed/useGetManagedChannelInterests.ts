import { Interest } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_QUERY_KEY } from "./useGetManagedChannel";

export const MANAGED_CHANNEL_INTERESTS_QUERY_KEY = (
  channelId: string
): QueryKey => [...MANAGED_CHANNEL_QUERY_KEY(channelId), "INTERESTS"];

export interface GetManagedChannelInterestsParams extends InfiniteQueryParams {
  channelId: string;
}

export const GetManagedChannelInterests = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetManagedChannelInterestsParams): Promise<
  ConnectedXMResponse<Interest[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/interests`,
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

export const useGetManagedChannelInterests = (
  channelId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelInterests>>
  >(
    MANAGED_CHANNEL_INTERESTS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelInterests({ channelId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
