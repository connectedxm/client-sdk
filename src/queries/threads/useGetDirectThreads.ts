import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { BaseThreadMember, Thread } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const DIRECT_THREADS_QUERY_KEY = (): QueryKey => {
  return ["DIRECT_THREADS"];
};

export interface GetDirectThreadsProps extends InfiniteQueryParams {}

export const GetDirectThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
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
