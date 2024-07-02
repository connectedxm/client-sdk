import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { Content } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CONTENTS_QUERY_KEY } from "./useGetContents";

export const CONTENT_QUERY_KEY = (contentId: string): QueryKey => [
  ...CONTENTS_QUERY_KEY(),
  contentId,
];

export const SET_CONTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContent>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENT_QUERY_KEY(...keyParams),
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
    CONTENT_QUERY_KEY(contentId),
    (params: SingleQueryParams) =>
      GetChannelContent({ contentId, channelId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!contentId && options.enabled,
    }
  );
};
