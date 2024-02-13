import { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import {
  SELF_CHAT_CHANNEL_QUERY_KEY,
  SET_SELF_CHAT_CHANNEL_QUERY_DATA,
} from "./useGetSelfChatChannel";

export const SELF_CHAT_CHANNELS_QUERY_KEY = () => ["CHANNELS"];

export const SET_SELF_CHAT_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_CHAT_CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfChannels>>,
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

interface GetSelfChannelsProps extends InfiniteQueryParams {}

export const GetSelfChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
}: GetSelfChannelsProps): Promise<ConnectedXMResponse<ChatChannelMember[]>> => {
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
      SET_SELF_CHAT_CHANNEL_QUERY_DATA as any,
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

const useGetChatChannels = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetSelfChannels>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetSelfChannels>>(
    SELF_CHAT_CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfChannels(params),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetChatChannels;
