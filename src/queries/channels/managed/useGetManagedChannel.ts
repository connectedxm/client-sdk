import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { Channel } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNELS_QUERY_KEY } from "./useGetManagedChannels";

export const MANAGED_CHANNEL_QUERY_KEY = (channelId: string): QueryKey => [
  ...MANAGED_CHANNELS_QUERY_KEY(),
  channelId,
];

export const SET_MANAGED_CHANNEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MANAGED_CHANNEL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetManagedChannel>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...MANAGED_CHANNEL_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetManagedChannelParams extends SingleQueryParams {
  channelId: string;
}

export const GetManagedChannel = async ({
  channelId,
  clientApiParams,
}: GetManagedChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/managed/${channelId}`);

  return data;
};

export const useGetManagedChannel = (
  channelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetManagedChannel>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetManagedChannel>>(
    MANAGED_CHANNEL_QUERY_KEY(channelId),
    (params) => GetManagedChannel({ channelId: channelId || "", ...params }),
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
