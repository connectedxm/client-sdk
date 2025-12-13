import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ConnectedXMResponse, ThreadCircle } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREADS_QUERY_KEY } from "@src/queries";

export const THREAD_CIRCLES_QUERY_KEY = (): QueryKey => [
  ...THREADS_QUERY_KEY(),
  "CIRCLES",
];

export const SET_THREAD_CIRCLES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadCircles>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_CIRCLES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadCirclesProps extends InfiniteQueryParams {
  type?: string;
}

export const GetThreadCircles = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
  clientApiParams,
}: GetThreadCirclesProps): Promise<ConnectedXMResponse<ThreadCircle[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/circles`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type: type || undefined,
    },
  });
  return data;
};

export const useGetThreadCircles = (
  params: Omit<
    GetThreadCirclesProps,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadCircles>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadCircles>>
  >(
    THREAD_CIRCLES_QUERY_KEY(),
    (params: GetThreadCirclesProps) => GetThreadCircles(params),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
