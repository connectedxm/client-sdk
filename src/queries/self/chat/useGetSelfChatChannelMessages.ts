import { ChatChannelMessage, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import {
  SELF_CHAT_CHANNEL_QUERY_KEY,
  SET_SELF_CHAT_CHANNEL_QUERY_DATA,
} from "./useGetSelfChatChannel";

export const SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY = (channelId: string) => [
  ...SELF_CHAT_CHANNEL_QUERY_KEY(channelId),
  "MESSAGES",
];

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

interface GetSelfChatChannelMessagesProps extends InfiniteQueryParams {
  channelId: string;
}

export const GetSelfChatChannelMessages = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
}: GetSelfChatChannelMessagesProps): Promise<
  ConnectedXMResponse<ChatChannelMessage[]>
> => {
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
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfChatChannelMessages>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfChatChannelMessages>>
  >(
    SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId),
    (params: Omit<GetSelfChatChannelMessagesProps, "channelId">) =>
      GetSelfChatChannelMessages({ ...params, channelId }),
    params,
    {
      ...options,
      enabled: !!token && !!channelId && (options?.enabled ?? true),
    }
  );
};