import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import { QueryClient, Updater } from "@tanstack/react-query";
import { CHAT_CHANNELS_QUERY_KEY } from "./useGetChatChannels";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const CHAT_CHANNEL_QUERY_KEY = (channelId: string): QueryKey => [
  ...CHAT_CHANNELS_QUERY_KEY(),
  channelId,
];

export const SET_CHAT_CHANNEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHAT_CHANNEL_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetChatChannel>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHAT_CHANNEL_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetChatChannelProps extends SingleQueryParams {
  channelId: string;
}

export const GetChatChannel = async ({
  channelId,
  clientApiParams,
}: GetChatChannelProps): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/chat/channels/${channelId}`);
  return data;
};

export const useGetChatChannel = (
  channelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChatChannel>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetChatChannel>>(
    CHAT_CHANNEL_QUERY_KEY(channelId),
    (params: any) =>
      GetChatChannel({
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
