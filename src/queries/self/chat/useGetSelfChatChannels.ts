import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import { ChatChannel, ChatChannelMember } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@context/queries/useConnectedInfiniteQuery";
import {
  InfiniteData,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SET_SELF_CHAT_CHANNEL_QUERY_DATA } from "./useGetSelfChatChannel";

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
  locale,
}: GetSelfChannelsProps): Promise<ConnectedXMResponse<ChatChannelMember[]>> => {
  const clientApi = await ClientAPI(locale);
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

const useGetChatChannels = () => {
  const queryClient = useQueryClient();
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfChannels>>>(
    SELF_CHAT_CHANNELS_QUERY_KEY(),
    (params: any) => GetSelfChannels(params),
    {
      enabled: !!token,
      onSuccess: (data) => {
        CacheIndividualQueries(
          data as any,
          queryClient,
          (channelId) => [channelId],
          SET_SELF_CHAT_CHANNEL_QUERY_DATA as any,
          (member: any) => {
            return {
              ...member,
              id: member.channelId.toString(),
            };
          }
        );
      },
    }
  );
};

export default useGetChatChannels;
