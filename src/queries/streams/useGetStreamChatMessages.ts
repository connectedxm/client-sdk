import { ConnectedXMResponse, StreamChatMessage } from "@interfaces";
import {
  CursorQueryParams,
  CursorQueryOptions,
  useConnectedCursorQuery,
} from "@src/queries/useConnectedCursorQuery";
import {
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const STREAM_CHAT_MESSAGES_QUERY_KEY = (
  streamId: string,
  sessionId: string
): QueryKey => ["STREAMS", streamId, sessionId, "MESSAGES"];

export const SET_STREAM_CHAT_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_CHAT_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamChatMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...STREAM_CHAT_MESSAGES_QUERY_KEY(keyParams[0], keyParams[1]),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetStreamChatMessagesProps extends CursorQueryParams {
  streamId: string;
  sessionId: string;
}

export const GetStreamChatMessages = async ({
  streamId,
  sessionId,
  cursor,
  pageSize,
  clientApiParams,
}: GetStreamChatMessagesProps): Promise<
  ConnectedXMResponse<StreamChatMessage[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/streams/${streamId}/sessions/${sessionId}/messages`,
    {
      params: {
        cursor: cursor || undefined,
        pageSize: pageSize || undefined,
      },
    }
  );

  return data;
};

export const useGetStreamChatMessages = (
  streamId: string = "",
  sessionId: string = "",
  params: Omit<
    CursorQueryParams,
    "cursor" | "queryClient" | "clientApiParams"
  > = {},
  options: CursorQueryOptions<
    Awaited<ReturnType<typeof GetStreamChatMessages>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedCursorQuery<
    Awaited<ReturnType<typeof GetStreamChatMessages>>
  >(
    STREAM_CHAT_MESSAGES_QUERY_KEY(streamId, sessionId),
    (params: Omit<GetStreamChatMessagesProps, "streamId" | "sessionId">) =>
      GetStreamChatMessages({ ...params, streamId, sessionId }),
    params,
    {
      ...options,
      enabled:
        !!authenticated &&
        !!streamId &&
        !!sessionId &&
        (options?.enabled ?? true),
    }
  );
};
