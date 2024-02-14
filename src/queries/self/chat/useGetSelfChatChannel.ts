import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { QueryClient, Updater } from "@tanstack/react-query";
import { SELF_CHAT_CHANNELS_QUERY_KEY } from "./useGetSelfChatChannels";

export const SELF_CHAT_CHANNEL_QUERY_KEY = (channelId: string) => [
  ...SELF_CHAT_CHANNELS_QUERY_KEY(),
  channelId,
];

export const SET_SELF_CHAT_CHANNEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_CHAT_CHANNEL_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetSelfChatChannel>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_CHAT_CHANNEL_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetSelfChatChannelProps extends SingleQueryParams {
  channelId: string;
}

export const GetSelfChatChannel = async ({
  channelId,
  clientApi,
}: GetSelfChatChannelProps): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const { data } = await clientApi.get(`/self/chat/channels/${channelId}`);
  return data;
};

const useGetSelfChatChannel = (
  channelId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfChatChannel>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfChatChannel>>(
    SELF_CHAT_CHANNEL_QUERY_KEY(channelId),
    (params: any) =>
      GetSelfChatChannel({
        channelId: channelId || "unknown",
        ...params,
      }),
    {
      staleTime: Infinity,
      ...options,
      enabled: !!token && !!channelId && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfChatChannel;
