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

export const PUBLIC_THREADS_QUERY_KEY = (): QueryKey => {
  return ["PUBLIC_THREADS"];
};

export const SET_PUBLIC_THREADS_QUERY_DATA = (
  client: QueryClient,
  response: Awaited<ReturnType<typeof GetPublicThreads>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...PUBLIC_THREADS_QUERY_KEY(), ...GetBaseInfiniteQueryKeys(...baseKeys)],
    setFirstPageData(response)
  );
};

export interface GetPublicThreadsProps extends InfiniteQueryParams {}

export const GetPublicThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  queryClient,
  search,
  locale,
  clientApiParams,
}: GetPublicThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/public`, {
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

export const useGetPublicThreads = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetPublicThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetPublicThreads>>
  >(
    PUBLIC_THREADS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetPublicThreads({ ...params }),
    params,
    {
      ...options,
    }
  );
};
