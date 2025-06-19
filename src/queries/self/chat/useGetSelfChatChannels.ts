import { ChatChannelMember, ConnectedXMResponse, ChatChannel } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { SELF_CHAT_CHANNEL_QUERY_KEY } from "./useGetSelfChatChannel";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { useConnectedXM } from "@src/hooks";

export const SELF_CHAT_CHANNELS_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "CHANNELS",
];

export const SET_SELF_CHAT_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_CHAT_CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfChatChannels>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_CHAT_CHANNELS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetSelfChatChannelsProps extends InfiniteQueryParams {}

export const GetSelfChatChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetSelfChatChannelsProps): Promise<ConnectedXMResponse<ChatChannel[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/chat/channels`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetSelfChatChannels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfChatChannels>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfChatChannels>>
  >(
    SELF_CHAT_CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfChatChannels(params),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
