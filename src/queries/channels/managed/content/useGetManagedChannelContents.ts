import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_QUERY_KEY } from "../useGetManagedChannel";

export const MANAGED_CHANNEL_CONTENTS_QUERY_KEY = (
  channelId: string
): QueryKey => [...MANAGED_CHANNEL_QUERY_KEY(channelId), "CONTENTS"];

export interface GetManagedChannelContentsParams extends InfiniteQueryParams {
  channelId: string;
}

export const GetManagedChannelContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  clientApiParams,
}: GetManagedChannelContentsParams): Promise<
  ConnectedXMResponse<Content[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/contents`,
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

export const useGetManagedChannelContents = (
  channelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelContents>>
  >(
    MANAGED_CHANNEL_CONTENTS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelContents({ ...params, channelId: channelId || "" }),
    params,
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
