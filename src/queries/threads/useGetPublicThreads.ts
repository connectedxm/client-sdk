import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Thread } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const PUBLIC_THREADS_QUERY_KEY = (): QueryKey => {
  return ["PUBLIC_THREADS"];
};

export interface GetPublicThreadsProps extends InfiniteQueryParams {}

export const GetPublicThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
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
