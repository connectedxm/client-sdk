import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Thread } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CacheIndividualQueries } from "@src/utilities";
import { THREAD_QUERY_KEY } from "./useGetThread";

export const THREADS_QUERY_KEY = (access?: "public" | "private"): QueryKey => {
  const keys = ["THREADS"];
  if (access) keys.push(access);
  return keys;
};

export const SET_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreads>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREADS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadsProps extends InfiniteQueryParams {
  access?: "public" | "private";
  groupId?: string;
  eventId?: string;
}

export const GetThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  queryClient,
  access,
  groupId,
  eventId,
  search,
  locale,
  clientApiParams,
}: GetThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      access: access || undefined,
      groupId: groupId || undefined,
      eventId: eventId || undefined,
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

export const useGetThreads = (
  access: "public" | "private" = "public",
  groupId?: string,
  eventId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetThreads>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreads>>>(
    THREADS_QUERY_KEY(access),
    (params: InfiniteQueryParams) =>
      GetThreads({ access, groupId, eventId, ...params }),
    params,
    {
      ...options,
    }
  );
};
