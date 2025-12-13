import { ConnectedXMResponse, ChannelCollection } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_COLLECTION_QUERY_KEY,
  CHANNEL_COLLECTIONS_QUERY_KEY,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channels
 */
export interface DeleteChannelCollectionParams extends MutationParams {
  channelId: string;
  collectionId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const DeleteChannelCollection = async ({
  channelId,
  collectionId,
  clientApiParams,
  queryClient,
}: DeleteChannelCollectionParams): Promise<
  ConnectedXMResponse<ChannelCollection>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<
    ConnectedXMResponse<ChannelCollection>
  >(`/channels/${channelId}/collections/${collectionId}`);

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: CHANNEL_COLLECTION_QUERY_KEY(channelId, collectionId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_COLLECTIONS_QUERY_KEY(channelId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useDeleteChannelCollection = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChannelCollection>>,
      Omit<DeleteChannelCollectionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelCollectionParams,
    Awaited<ReturnType<typeof DeleteChannelCollection>>
  >(DeleteChannelCollection, options);
};
