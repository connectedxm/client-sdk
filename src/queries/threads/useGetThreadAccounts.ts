import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ConnectedXMResponse, ThreadAccount } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_QUERY_KEY } from "./useGetThread";

export const THREAD_ACCOUNTS_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "ACCOUNTS",
];

export const SET_THREAD_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadAccounts>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_ACCOUNTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadAccountsProps extends InfiniteQueryParams {
  threadId: string;
}

export const GetThreadAccounts = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetThreadAccountsProps): Promise<ConnectedXMResponse<ThreadAccount[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetThreadAccounts = (
  threadId: string = "",
  params: Omit<
    GetThreadAccountsProps,
    "threadId" | "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadAccounts>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadAccounts>>
  >(
    THREAD_ACCOUNTS_QUERY_KEY(threadId),
    (params: Omit<GetThreadAccountsProps, "threadId">) =>
      GetThreadAccounts({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    }
  );
};
