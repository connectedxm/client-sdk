import { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "./useGetThread";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const THREAD_MESSAGES_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "MESSAGES",
];

export const SET_THREAD_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_MESSAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadMessagesProps extends InfiniteQueryParams {
  threadId: string;
}

export const GetThreadMessages = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetThreadMessagesProps): Promise<ConnectedXMResponse<ThreadMessage[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/messages`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetThreadMessages = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessages>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessages>>
  >(
    THREAD_MESSAGES_QUERY_KEY(threadId),
    (params: Omit<GetThreadMessagesProps, "threadId">) =>
      GetThreadMessages({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    }
  );
};
