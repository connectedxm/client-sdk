import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { Content } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_CONTENTS_QUERY_KEY } from "./useGetManagedChannelContents";

export const MANAGED_CHANNEL_CONTENT_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [...MANAGED_CHANNEL_CONTENTS_QUERY_KEY(channelId), contentId];

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
    `/channels/managed/${channelId}/contents/${contentId}`
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
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};
