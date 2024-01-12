import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import { ChatChannelMessage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@context/queries/useConnectedInfiniteQuery";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
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
  locale,
}: GetSelfChatChannelMessagesProps): Promise<
  ConnectedXMResponse<ChatChannelMessage[]>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(
    `/self/chat/channels/${channelId}/messages`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: 25,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetSelfChatChannelMessages = (channelId: string) => {
  const queryClient = useQueryClient();
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfChatChannelMessages>>
  >(
    SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId),
    (params: Omit<GetSelfChatChannelMessagesProps, "channelId">) =>
      GetSelfChatChannelMessages({ ...params, channelId }),
    {
      enabled: !!token,
      onSuccess: (data) => {
        SET_SELF_CHAT_CHANNEL_QUERY_DATA(queryClient, [channelId], (old) => ({
          ...old,
          data: {
            ...old.data,
            read: true,
          },
        }));
      },
    }
  );
};

export default useGetSelfChatChannelMessages;
