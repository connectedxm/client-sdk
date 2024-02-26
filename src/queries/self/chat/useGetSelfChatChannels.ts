import { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SELF_CHAT_CHANNEL_QUERY_KEY } from "./useGetSelfChatChannel";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_CHAT_CHANNELS_QUERY_KEY = (): QueryKey => ["CHANNELS"];

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
}: GetSelfChatChannelsProps): Promise<
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

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data as any,
      queryClient,
      (channelId) => SELF_CHAT_CHANNEL_QUERY_KEY(channelId),
      locale,
      (member: any) => {
        return {
          ...member,
          id: member.channelId.toString(),
        };
      }
    );
  }

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
      enabled: authenticated && (options.enabled ?? true),
    }
  );
};
