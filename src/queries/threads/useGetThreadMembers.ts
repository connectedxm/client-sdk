import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { BaseGroup, ThreadMember, ThreadMemberRole } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "./useGetThread";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const THREAD_MEMBERS_QUERY_KEY = (
  threadId: string,
  role?: keyof typeof ThreadMemberRole
): QueryKey => {
  const keys = [...THREAD_QUERY_KEY(threadId), "MEMBERS"];

  if (role) {
    keys.push(role);
  }

  return keys;
};

export interface GetThreadMembersProps extends InfiniteQueryParams {
  threadId: string;
  role?: keyof typeof ThreadMemberRole;
}

export const GetThreadMembers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  role,
  threadId,
  clientApiParams,
}: GetThreadMembersProps): Promise<
  ConnectedXMResponse<{
    members: ThreadMember[];
    groups: BaseGroup[];
  }>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/members`, {
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

export const useGetThreadMembers = (
  threadId: string = "",
  role?: keyof typeof ThreadMemberRole,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMembers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMembers>>
  >(
    THREAD_MEMBERS_QUERY_KEY(threadId, role),
    (params: InfiniteQueryParams) =>
      GetThreadMembers({ threadId, role, ...params }),
    params,
    {
      ...options,
      enabled: !!threadId && (options?.enabled ?? true),
    }
  );
};
