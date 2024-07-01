import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { ChannelCollection } from "@interfaces";
import { CHANNEL_COLLECTIONS_QUERY_KEY } from "./useGetChannelCollections";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CHANNEL_COLLECTION_QUERY_KEY = (
  channelId: string,
  collectionId: string
): QueryKey => [...CHANNEL_COLLECTIONS_QUERY_KEY(channelId), collectionId];

export const SET_CHANNEL_COLLECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_COLLECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelCollection>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHANNEL_COLLECTION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetChannelCollectionParams extends SingleQueryParams {
  channelId: string;
  collectionId: string;
}

export const GetChannelCollection = async ({
  channelId,
  collectionId,
  clientApiParams,
}: GetChannelCollectionParams): Promise<
  ConnectedXMResponse<ChannelCollection>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/collections/${collectionId}`
  );

  return data;
};

export const useGetChannelCollection = (
  channelId: string = "",
  collectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelCollection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelCollection>>(
    CHANNEL_COLLECTION_QUERY_KEY(channelId, collectionId),
    (params) => GetChannelCollection({ channelId, collectionId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!collectionId && (options?.enabled ?? true),
    }
  );
};
