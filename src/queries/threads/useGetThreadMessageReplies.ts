import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_MESSAGES_QUERY_KEY } from "./useGetThreadMessages";

/**
 * Cache key for the sub-thread under a specific parent message. Nested
 * under THREAD_MESSAGES_QUERY_KEY so invalidating the message list also
 * invalidates open sub-threads, which is the usually-desired behavior
 * when the thread context changes.
 */
export const THREAD_MESSAGE_REPLIES_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => [
  ...THREAD_MESSAGES_QUERY_KEY(threadId),
  messageId,
  "REPLIES",
];

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
  clientApiParams,
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
      },
    }
  );
  return data;
};

/**
 * Page-paginated list of replies (sub-thread) under a parent message.
 * Oldest-first so the sub-thread reads top-down. Disabled until both
 * threadId and messageId are present.
 */
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
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessageReplies>>
  >(
    THREAD_MESSAGE_REPLIES_QUERY_KEY(threadId, messageId),
    (innerParams: InfiniteQueryParams) =>
      GetThreadMessageReplies({ ...innerParams, threadId, messageId }),
    params,
    {
      ...options,
      enabled:
        !!authenticated &&
        !!threadId &&
        !!messageId &&
        (options?.enabled ?? true),
    }
  );
};
