import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import type { ConnectedXMResponse, Thread } from "@interfaces";
import { useConnected } from "@src/hooks";
import { GetThreads, THREADS_QUERY_KEY } from "./useGetThreads";

export const DIRECT_THREADS_QUERY_KEY = () => [
  ...THREADS_QUERY_KEY(),
  "DIRECT",
];

export interface GetDirectThreadsProps extends InfiniteQueryParams {}

export const GetDirectThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetDirectThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  return GetThreads({
    pageParam,
    pageSize,
    orderBy,
    search,
    type: "direct",
    clientApiParams,
  });
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
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetDirectThreads>>
  >(
    DIRECT_THREADS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetDirectThreads(params),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
