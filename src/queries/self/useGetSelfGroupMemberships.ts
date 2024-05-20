import type { GroupMembership, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_GROUP_MEMBERSHIPS_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "GROUP_MEMBERSHIPS",
];

export interface GetSelfGroupMembershipsProps extends InfiniteQueryParams {}

export const GetSelfGroupMemberships = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfGroupMembershipsProps): Promise<
  ConnectedXMResponse<GroupMembership[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/groups`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSelfGroupMemberships = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfGroupMemberships>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfGroupMemberships>>
  >(
    SELF_GROUP_MEMBERSHIPS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfGroupMemberships({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
