import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import {
  Account,
  CommunityMembershipRole,
  CommunityRequestStatus,
} from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

interface InvitableAccount extends Account {
  communityRequests: {
    status: CommunityRequestStatus;
  }[];
  communities: {
    role: CommunityMembershipRole;
  }[];
}

export const COMMUNITY_INVITABLE_ACCOUNTS_QUERY_KEY = (
  communityId: string
): QueryKey => [...COMMUNITY_QUERY_KEY(communityId), "INVITABLE_ACCOUNTS"];

export interface GetCommunityInvitableAccountsProps
  extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityInvitableAccounts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  clientApiParams,
}: GetCommunityInvitableAccountsProps): Promise<
  ConnectedXMResponse<InvitableAccount[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/communities/${communityId}/invites`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetCommunityInvitableAccounts = (
  communityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityInvitableAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityInvitableAccounts>>
  >(
    COMMUNITY_INVITABLE_ACCOUNTS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityInvitableAccounts({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
