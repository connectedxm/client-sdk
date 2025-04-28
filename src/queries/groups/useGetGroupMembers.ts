import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GroupMembership, GroupMembershipRole } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_MEMBERS_QUERY_KEY = (
  groupId: string,
  role?: keyof typeof GroupMembershipRole
): QueryKey => {
  const keys = [...GROUP_QUERY_KEY(groupId), "MEMBERS"];

  if (role) {
    keys.push(role);
  }

  return keys;
};

export interface GetGroupMembersProps extends InfiniteQueryParams {
  groupId: string;
  role?: keyof typeof GroupMembershipRole;
}

export const GetGroupMembers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  role,
  groupId,
  clientApiParams,
}: GetGroupMembersProps): Promise<ConnectedXMResponse<GroupMembership[]>> => {
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

export const useGetGroupMembers = (
  groupId: string = "",
  role?: keyof typeof GroupMembershipRole,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupMembers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupMembers>>>(
    GROUP_MEMBERS_QUERY_KEY(groupId, role),
    (params: InfiniteQueryParams) =>
      GetGroupMembers({ groupId, role, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
