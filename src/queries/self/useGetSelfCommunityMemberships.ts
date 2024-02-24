import type { CommunityMembership, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "COMMUNITY_MEMBERSHIPS",
];

export interface GetSelfCommunityMembershipsProps extends InfiniteQueryParams {}

export const GetSelfCommunityMemberships = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfCommunityMembershipsProps): Promise<
  ConnectedXMResponse<CommunityMembership[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/communities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSelfCommunityMemberships = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfCommunityMemberships>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfCommunityMemberships>>
  >(
    SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfCommunityMemberships({ ...params }),
    params,
    {
      ...options,
    }
  );
};
