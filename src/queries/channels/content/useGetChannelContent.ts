import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { Content } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENTS_QUERY_KEY } from "./useGetChannelContents";

export const CHANNEL_CONTENT_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [...CHANNEL_CONTENTS_QUERY_KEY(channelId), contentId];

export const SET_CHANNEL_CONTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContent>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHANNEL_CONTENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetChannelContentParams extends SingleQueryParams {
  channelId: string;
  contentId: string;
}

export const GetChannelContent = async ({
  contentId,
  channelId,
  clientApiParams,
}: GetChannelContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/contents/${contentId}`
  );

  return data;
};

export const useGetChannelContent = (
  channelId: string = "",
  contentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelContent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelContent>>(
    CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    (params: SingleQueryParams) =>
      GetChannelContent({ contentId, channelId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!contentId && options.enabled,
    }
  );
};
