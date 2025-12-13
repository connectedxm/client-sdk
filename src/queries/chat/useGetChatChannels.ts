import { ConnectedXMResponse, ChatChannelMember } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_QUERY_KEY } from "../self/useGetSelf";
import { useConnected } from "@src/hooks";

export const CHAT_CHANNELS_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "CHAT",
  "CHANNELS",
];

export const SET_CHAT_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHAT_CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChatChannels>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHAT_CHANNELS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetChatChannelsProps extends InfiniteQueryParams {}

export const GetChatChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChatChannelsProps): Promise<
  ConnectedXMResponse<ChatChannelMember[]>
> => {
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

export const useGetChatChannels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChatChannels>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChatChannels>>
  >(
    CHAT_CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetChatChannels(params),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
