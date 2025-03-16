import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { ChannelCollection } from "@interfaces";
import { CHANNEL_COLLECTIONS_QUERY_KEY } from "./useGetChannelCollections";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CHANNEL_COLLECTION_QUERY_KEY = (
  channelId: string,
  collectionId: string
): QueryKey => [...CHANNEL_COLLECTIONS_QUERY_KEY(channelId), collectionId];

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
