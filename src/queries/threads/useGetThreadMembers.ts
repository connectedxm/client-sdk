import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { BaseGroup, ThreadMember, ThreadMemberRole } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
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

export const SET_THREAD_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMembers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_MEMBERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
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
