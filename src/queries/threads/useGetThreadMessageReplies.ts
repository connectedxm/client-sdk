import { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { CacheIndividualQueries } from "@src/utilities";
import { THREAD_MESSAGE_QUERY_KEY } from "./useGetThreadMessage";

export const THREAD_MESSAGE_REPLIES_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => [...THREAD_MESSAGE_QUERY_KEY(threadId, messageId), "REPLIES"];

export const SET_THREAD_MESSAGE_REPLIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGE_REPLIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessageReplies>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_MESSAGE_REPLIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadMessageRepliesProps extends InfiniteQueryParams {
  threadId: string;
  messageId: string;
}

export const GetThreadMessageReplies = async ({
  threadId,
  messageId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetThreadMessageRepliesProps): Promise<
  ConnectedXMResponse<ThreadMessage[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/threads/${threadId}/messages/${messageId}/replies`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (messageId) => THREAD_MESSAGE_QUERY_KEY(threadId, messageId),
      locale
    );
  }

  return data;
};

export const useGetThreadMessageReplies = (
  threadId: string = "",
  messageId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessageReplies>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessageReplies>>
  >(
    THREAD_MESSAGE_REPLIES_QUERY_KEY(threadId, messageId),
    (params: Omit<GetThreadMessageRepliesProps, "threadId" | "messageId">) =>
      GetThreadMessageReplies({ ...params, threadId, messageId }),
    params,
    {
      refetchInterval: 5 * 1000,
      ...options,
      enabled:
        !!authenticated &&
        !!threadId &&
        !!messageId &&
        (options?.enabled ?? true),
    }
  );
};
