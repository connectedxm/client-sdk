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
  CHAT_CHANNEL_QUERY_KEY,
  SET_CHAT_CHANNEL_QUERY_DATA,
} from "./useGetChatChannel";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const CHAT_CHANNEL_MESSAGES_QUERY_KEY = (
  channelId: string
): QueryKey => [...CHAT_CHANNEL_QUERY_KEY(channelId), "MESSAGES"];

export const SET_CHAT_CHANNEL_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHAT_CHANNEL_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChatChannelMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHAT_CHANNEL_MESSAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetChatChannelMessagesProps extends InfiniteQueryParams {
  channelId: string;
}

export const GetChatChannelMessages = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
}: GetChatChannelMessagesProps): Promise<
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
    SET_CHAT_CHANNEL_QUERY_DATA(queryClient, [channelId], (old) => {
      if (old && old.data) {
        return {
          ...old,
          data: {
            ...old.data,
            read: true,
          },
        };
      }
      return old;
    });
  }

  return data;
};

export const useGetChatChannelMessages = (
  channelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChatChannelMessages>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChatChannelMessages>>
  >(
    CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId),
    (params: Omit<GetChatChannelMessagesProps, "channelId">) =>
      GetChatChannelMessages({ ...params, channelId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!channelId && (options?.enabled ?? true),
    }
  );
};
