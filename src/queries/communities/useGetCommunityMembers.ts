import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CommunityMembership, CommunityMembershipRole } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const COMMUNITY_MEMBERS_QUERY_KEY = (
  communityId: string,
  role?: keyof typeof CommunityMembershipRole
): QueryKey => {
  const keys = [...COMMUNITY_QUERY_KEY(communityId), "MEMBERS"];

  if (role) {
    keys.push(role);
  }

  return keys;
};

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

export interface GetCommunityMembersProps extends InfiniteQueryParams {
  communityId: string;
  role?: keyof typeof CommunityMembershipRole;
}

export const GetCommunityMembers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  role,
  communityId,
  clientApiParams,
}: GetCommunityMembersProps): Promise<
  ConnectedXMResponse<CommunityMembership[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/communities/${communityId}/members`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      role: role || undefined,
    },
  });
  return data;
};

export const useGetCommunityMembers = (
  communityId: string = "",
  role?: keyof typeof CommunityMembershipRole,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityMembers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityMembers>>
  >(
    COMMUNITY_MEMBERS_QUERY_KEY(communityId, role),
    (params: InfiniteQueryParams) =>
      GetCommunityMembers({ communityId, role, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
