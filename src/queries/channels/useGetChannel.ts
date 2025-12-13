import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { Channel } from "@interfaces";
import { CHANNELS_QUERY_KEY } from "./useGetChannels";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CHANNEL_QUERY_KEY = (channelId: string): QueryKey => [
  ...CHANNELS_QUERY_KEY(),
  channelId,
];

export const SET_CHANNEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannel>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHANNEL_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetChannelParams extends SingleQueryParams {
  channelId: string;
}

export const GetChannel = async ({
  channelId,
  clientApiParams,
}: GetChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/${channelId}`);

  return data;
};

export const useGetChannel = (
  channelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannel>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannel>>(
    CHANNEL_QUERY_KEY(channelId),
    (params) => GetChannel({ channelId: channelId || "", ...params }),
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
