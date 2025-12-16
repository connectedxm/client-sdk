import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { GroupMembership, GroupMembershipRole } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "../useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_MEMBERSHIPS_QUERY_KEY = (
  groupId: string,
  role?: keyof typeof GroupMembershipRole
): QueryKey => {
  const keys = [...GROUP_QUERY_KEY(groupId), "MEMBERS"];

  if (role) {
    keys.push(role);
  }

  return keys;
};

export const SET_GROUP_MEMBERSHIPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_MEMBERSHIPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupMemberships>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...GROUP_MEMBERSHIPS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetGroupMembershipsProps extends InfiniteQueryParams {
  groupId: string;
  role?: keyof typeof GroupMembershipRole;
}

export const GetGroupMemberships = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  role,
  groupId,
  clientApiParams,
}: GetGroupMembershipsProps): Promise<
  ConnectedXMResponse<GroupMembership[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/members`, {
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

export const useGetGroupMemberships = (
  groupId: string = "",
  role?: keyof typeof GroupMembershipRole,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupMemberships>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupMemberships>>
  >(
    GROUP_MEMBERSHIPS_QUERY_KEY(groupId, role),
    (params: InfiniteQueryParams) =>
      GetGroupMemberships({ groupId, role, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
