import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Thread, ThreadStatus } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const PRIVATE_THREADS_QUERY_KEY = (status?: string): QueryKey => {
  const keys = ["THREADS"];
  if (status) keys.push(status);
  return keys;
};

export interface GetPrivateThreadsProps extends InfiniteQueryParams {
  status?: string;
}

export const GetPrivateThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
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

  return data;
};

export const useGetPrivateThreads = (
  status?: keyof typeof ThreadStatus,
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
    PRIVATE_THREADS_QUERY_KEY(status),
    (params: InfiniteQueryParams) => GetPrivateThreads({ status, ...params }),
    params,
    {
      ...options,
    }
  );
};
