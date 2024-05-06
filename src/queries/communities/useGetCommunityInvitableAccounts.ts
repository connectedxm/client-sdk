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

export interface GetCommunityInvitableAccountProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityInvitableAccount = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  clientApiParams,
}: GetCommunityInvitableAccountProps): Promise<
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

export const useGetCommunityInvitableAccount = (
  communityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityInvitableAccount>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityInvitableAccount>>
  >(
    COMMUNITY_INVITABLE_ACCOUNTS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityInvitableAccount({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
