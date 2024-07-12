import { Interest } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContent";

export const CHANNEL_CONTENT_INTERESTS_QUERY_KEY = (
  contentId: string
): QueryKey => [...CONTENT_QUERY_KEY(contentId), "INTERESTS"];

export interface GetChannelContentInterestsParams extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
}

export const GetChannelContentInterests = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChannelContentInterestsParams): Promise<
  ConnectedXMResponse<Interest[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/contents/${contentId}/interests`,
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

export const useGetChannelContentInterests = (
  channelId: string,
  contentId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentInterests>>
  >(
    CHANNEL_CONTENT_INTERESTS_QUERY_KEY(contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentInterests({ channelId, contentId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};
