import { ConnectedXMResponse, ChannelCollection } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_COLLECTIONS_QUERY_KEY,
  SET_CHANNEL_COLLECTION_QUERY_DATA,
} from "@src/queries/channels";
import { ChannelCollectionUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface UpdateChannelCollectionParams extends MutationParams {
  channelId: string;
  collectionId: string;
  collection: ChannelCollectionUpdateInputs;
}

/**
 * @category Methods
 * @group Channels
 */
export const UpdateChannelCollection = async ({
  channelId,
  collection,
  collectionId,
  clientApiParams,
  queryClient,
}: UpdateChannelCollectionParams): Promise<
  ConnectedXMResponse<ChannelCollection>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChannelCollection>>(
    `/channels/${channelId}/collections/${collectionId}`,
    collection
  );

  if (queryClient && data.status === "ok") {
    SET_CHANNEL_COLLECTION_QUERY_DATA(
      queryClient,
      [channelId, collectionId],
      data,
      [clientApiParams.locale]
    );
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
export const useUpdateChannelCollection = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateChannelCollection>>,
      Omit<UpdateChannelCollectionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelCollectionParams,
    Awaited<ReturnType<typeof UpdateChannelCollection>>
  >(UpdateChannelCollection, options);
};
