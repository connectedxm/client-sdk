import { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { THREAD_MESSAGE_QUERY_KEY } from "./useGetThreadMessage";

export const THREAD_MESSAGE_REPLIES_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => [...THREAD_MESSAGE_QUERY_KEY(threadId, messageId), "REPLIES"];

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
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

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
