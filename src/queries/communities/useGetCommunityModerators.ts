import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CommunityMembership } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const COMMUNITY_MODERATORS_QUERY_KEY = (
  communityId: string
): QueryKey => [...COMMUNITY_QUERY_KEY(communityId), "MODERATORS"];

export const SET_COMMUNITY_MODERATORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_MODERATORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityModerators>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_MODERATORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetCommunityModeratorsProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityModerators = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  clientApiParams,
}: GetCommunityModeratorsProps): Promise<
  ConnectedXMResponse<CommunityMembership[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/communities/${communityId}/moderators`,
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

export const useGetCommunityModerators = (
  communityId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityModerators>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityModerators>>
  >(
    COMMUNITY_MODERATORS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityModerators({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
