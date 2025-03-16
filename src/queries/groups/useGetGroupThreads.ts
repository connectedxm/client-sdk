import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GroupThread } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_THREADS_QUERY_KEY = (groupId: string): QueryKey => [
  ...GROUP_QUERY_KEY(groupId),
  "THREADS",
];

export interface GetGroupThreadsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  groupId,
  clientApiParams,
}: GetGroupThreadsProps): Promise<ConnectedXMResponse<GroupThread[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/threads`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetGroupThreads = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupThreads>>>(
    GROUP_THREADS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) => GetGroupThreads({ groupId, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
