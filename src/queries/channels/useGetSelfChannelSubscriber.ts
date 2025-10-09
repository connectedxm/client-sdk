import { ChannelSubscriber } from "@interfaces";
import {
  useConnectedSingleQuery,
  SingleQueryParams,
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_CHANNEL_SUBSCRIBER_QUERY_KEY = (
  channelId: string
): QueryKey => ["CHANNELS", channelId, "SUBSCRIBERS", "SELF"];

export const SET_SELF_CHANNEL_SUBSCRIBER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_CHANNEL_SUBSCRIBER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfChannelSubscriber>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_CHANNEL_SUBSCRIBER_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfChannelSubscriberParams extends SingleQueryParams {
  channelId: string;
}

export const GetSelfChannelSubscriber = async ({
  channelId,
  clientApiParams,
}: GetSelfChannelSubscriberParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/subscribers/self`
  );

  return data;
};

export const useGetSelfChannelSubscriber = (
  channelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfChannelSubscriber>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfChannelSubscriber>>(
    SELF_CHANNEL_SUBSCRIBER_QUERY_KEY(channelId),
    (params) =>
      GetSelfChannelSubscriber({ channelId: channelId || "", ...params }),
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
