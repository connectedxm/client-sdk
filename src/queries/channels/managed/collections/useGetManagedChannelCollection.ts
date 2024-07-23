import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { ChannelCollection } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_COLLECTIONS_QUERY_KEY } from "./useGetManagedChannelCollections";

export const MANAGED_CHANNEL_COLLECTION_QUERY_KEY = (
  channelId: string,
  collectionId: string
): QueryKey => [
  ...MANAGED_CHANNEL_COLLECTIONS_QUERY_KEY(channelId),
  collectionId,
];

export const SET_MANAGED_CHANNEL_COLLECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MANAGED_CHANNEL_COLLECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetManagedChannelCollection>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...MANAGED_CHANNEL_COLLECTION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetManagedChannelCollectionParams extends SingleQueryParams {
  channelId: string;
  collectionId: string;
}

export const GetManagedChannelCollection = async ({
  channelId,
  collectionId,
  clientApiParams,
}: GetManagedChannelCollectionParams): Promise<
  ConnectedXMResponse<ChannelCollection>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/collections/${collectionId}`
  );

  return data;
};

export const useGetManagedChannelCollection = (
  channelId: string = "",
  collectionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetManagedChannelCollection>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetManagedChannelCollection>
  >(
    MANAGED_CHANNEL_COLLECTION_QUERY_KEY(channelId, collectionId),
    (params) =>
      GetManagedChannelCollection({ channelId, collectionId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!collectionId && (options?.enabled ?? true),
    }
  );
};
