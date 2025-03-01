import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { BaseThreadMember, Thread } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CacheIndividualQueries } from "@src/utilities";
import { THREAD_QUERY_KEY } from "./useGetThread";

export const DIRECT_THREADS_QUERY_KEY = (): QueryKey => {
  return ["DIRECT_THREADS"];
};

export const SET_DIRECT_THREADS_QUERY_DATA = (
  client: QueryClient,
  response: Awaited<ReturnType<typeof GetDirectThreads>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...DIRECT_THREADS_QUERY_KEY(), ...GetBaseInfiniteQueryKeys(...baseKeys)],
    setFirstPageData(response)
  );
};

export interface GetDirectThreadsProps extends InfiniteQueryParams {}

export const GetDirectThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  queryClient,
  search,
  locale,
  clientApiParams,
}: GetDirectThreadsProps): Promise<
  ConnectedXMResponse<(Thread & { members: BaseThreadMember[] })[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/direct`, {
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

export const useGetDirectThreads = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetDirectThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetDirectThreads>>
  >(
    DIRECT_THREADS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetDirectThreads({ ...params }),
    params,
    {
      ...options,
    }
  );
};
