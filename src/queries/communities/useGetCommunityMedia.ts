import { Activity } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const COMMUNITY_MEDIA_QUERY_KEY = (communityId: string): QueryKey => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "MEDIA",
];

export const SET_COMMUNITY_MEDIA_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_MEDIA_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityMedia>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_MEDIA_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetCommunityMediaProps extends InfiniteQueryParams {
  communityId: string;
  type?: "images" | "videos";
}

export const GetCommunityMedia = async ({
  communityId,
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetCommunityMediaProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/communities/${communityId}/media`, {
    params: {
      type: type || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetCommunityMedia = (
  communityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityMedia>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityMedia>>
  >(
    COMMUNITY_MEDIA_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityMedia({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
