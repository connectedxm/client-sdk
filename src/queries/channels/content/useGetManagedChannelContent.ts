import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { Content } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_CONTENTS_QUERY_KEY } from "./useGetManagedChannelContents";

export const MANAGED_CHANNEL_CONTENT_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [...MANAGED_CHANNEL_CONTENTS_QUERY_KEY(channelId), contentId];

export const SET_MANAGED_CHANNEL_CONTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MANAGED_CHANNEL_CONTENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetManagedChannelContent>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...MANAGED_CHANNEL_CONTENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetManagedChannelContentParams extends SingleQueryParams {
  channelId: string;
  contentId: string;
}

export const GetManagedChannelContent = async ({
  contentId,
  channelId,
  clientApiParams,
}: GetManagedChannelContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/manage/contents/${contentId}`
  );

  return data;
};

export const useGetManagedChannelContent = (
  channelId: string = "",
  contentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetManagedChannelContent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetManagedChannelContent>>(
    MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    (params: SingleQueryParams) =>
      GetManagedChannelContent({ contentId, channelId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!contentId && options.enabled,
    }
  );
};
