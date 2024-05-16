import { ChatChannelMessage, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import {
  SELF_CHAT_CHANNEL_QUERY_KEY,
  SET_SELF_CHAT_CHANNEL_QUERY_DATA,
} from "./useGetSelfChatChannel";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY = (
  channelId: string
): QueryKey => [...SELF_CHAT_CHANNEL_QUERY_KEY(channelId), "MESSAGES"];

export const SET_SELF_CHAT_CHANNEL_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfChatChannelMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetSelfChatChannelMessagesProps extends InfiniteQueryParams {
  channelId: string;
}

export const GetSelfChatChannelMessages = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
}: GetSelfChatChannelMessagesProps): Promise<
  ConnectedXMResponse<ChatChannelMessage[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/chat/channels/${channelId}/messages`,
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
    SET_SELF_CHAT_CHANNEL_QUERY_DATA(queryClient, [channelId], (old) => ({
      ...old,
      data: {
        ...old.data,
        read: true,
      },
    }));
  }

  return data;
};

export const useGetSelfChatChannelMessages = (
  channelId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfChatChannelMessages>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfChatChannelMessages>>
  >(
    SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId),
    (params: Omit<GetSelfChatChannelMessagesProps, "channelId">) =>
      GetSelfChatChannelMessages({ ...params, channelId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!channelId && (options?.enabled ?? true),
    }
  );
};
