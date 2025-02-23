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

export const PRIVATE_THREADS_QUERY_KEY = (status?: string): QueryKey => {
  const keys = ["THREADS"];
  if (status) keys.push(status);
  return keys;
};

export const SET_PRIVATE_THREADS_QUERY_DATA = (
  client: QueryClient,
  response: Awaited<ReturnType<typeof GetPrivateThreads>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...PRIVATE_THREADS_QUERY_KEY(), ...GetBaseInfiniteQueryKeys(...baseKeys)],
    setFirstPageData(response)
  );
};

export interface GetPrivateThreadsProps extends InfiniteQueryParams {
  status?: string;
}

export const GetPrivateThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  queryClient,
  search,
  status,
  locale,
  clientApiParams,
}: GetPrivateThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
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

export const useGetPrivateThreads = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > & { status?: string } = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetPrivateThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetPrivateThreads>>
  >(
    PRIVATE_THREADS_QUERY_KEY(params.status),
    (params: InfiniteQueryParams) => GetPrivateThreads({ ...params }),
    params,
    {
      ...options,
    }
  );
};
