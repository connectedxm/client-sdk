import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import { QueryClient, Updater } from "@tanstack/react-query";
import { SELF_CHAT_CHANNELS_QUERY_KEY } from "./useGetSelfChatChannels";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_CHAT_CHANNEL_QUERY_KEY = (channelId: string): QueryKey => [
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

export interface GetSelfChatChannelProps extends SingleQueryParams {
  channelId: string;
}

export const GetSelfChatChannel = async ({
  channelId,
  clientApiParams,
}: GetSelfChatChannelProps): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/chat/channels/${channelId}`);
  return data;
};

export const useGetSelfChatChannel = (
  channelId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfChatChannel>> = {}
) => {
  const { authenticated } = useConnectedXM();

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
      enabled: !!authenticated && !!channelId && (options?.enabled ?? true),
    }
  );
};
