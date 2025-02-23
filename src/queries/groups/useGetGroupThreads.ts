import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GroupThread } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "../threads/useGetThread";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_THREADS_QUERY_KEY = (groupId: string): QueryKey => [
  ...GROUP_QUERY_KEY(groupId),
  "THREADS",
];

export const SET_GROUP_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupThreads>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...GROUP_THREADS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetGroupThreadsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  groupId,
  queryClient,
  clientApiParams,
  locale,
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

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (threadId) => THREAD_QUERY_KEY(threadId),
      locale
    );
  }

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
