import { ClientAPI } from "@src/ClientAPI";
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

export const COMMUNITY_MEMBERS_QUERY_KEY = (communityId: string) => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "MEMBERS",
];

export const SET_COMMUNITY_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityMembers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_MEMBERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetCommunityMembersProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityMembers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  locale,
}: GetCommunityMembersProps): Promise<
  ConnectedXMResponse<CommunityMembership[]>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/communities/${communityId}/members`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetCommunityMembers = (
  communityId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetCommunityMembers>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetCommunityMembers>>(
    COMMUNITY_MEMBERS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityMembers({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!communityId && (options?.enabled ?? true),
    }
  );
};

export default useGetCommunityMembers;
