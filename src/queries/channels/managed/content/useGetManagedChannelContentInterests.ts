import { Interest } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_CONTENT_QUERY_KEY } from "./useGetManagedChannelContent";

export const MANAGED_CHANNEL_CONTENT_INTERESTS_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [
  ...MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
  "INTERESTS",
];

export interface GetManagedChannelContentInterestsParams
  extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
}

export const GetManagedChannelContentInterests = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetManagedChannelContentInterestsParams): Promise<
  ConnectedXMResponse<Interest[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/contents/${contentId}/interests`,
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

export const useGetManagedChannelContentInterests = (
  channelId: string,
  contentId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelContentInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelContentInterests>>
  >(
    MANAGED_CHANNEL_CONTENT_INTERESTS_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelContentInterests({ channelId, contentId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};
