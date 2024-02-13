import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CommunityMembership } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITY_MODERATORS_QUERY_KEY = (communityId: string) => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "MODERATORS",
];

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

interface GetCommunityModeratorsProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityModerators = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  clientApi,
}: GetCommunityModeratorsProps): Promise<
  ConnectedXMResponse<CommunityMembership[]>
> => {
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
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityModerators>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityModerators>>
  >(
    COMMUNITY_MODERATORS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityModerators({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!communityId && (options?.enabled ?? true),
    }
  );
};
