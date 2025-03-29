import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { Channel } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNELS_QUERY_KEY } from "./useGetManagedChannels";

export const MANAGED_CHANNEL_QUERY_KEY = (channelId: string): QueryKey => [
  ...MANAGED_CHANNELS_QUERY_KEY(),
  channelId,
];

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
