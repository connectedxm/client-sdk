import { ConnectedXMResponse, ChannelCollection } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_COLLECTION_QUERY_KEY,
  CHANNEL_COLLECTIONS_QUERY_KEY,
} from "@src/queries/channels";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface UpdateChannelCollectionInput {
  name?: string;
  description?: string;
}

export interface UpdateChannelCollectionParams extends MutationParams {
  channelId: string;
  collection: UpdateChannelCollectionInput;
  collectionId: string;
}

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
    `/channels/managed/${channelId}/collections/${collectionId}`,
    collection
  );

  if (queryClient && data.status === "ok") {
    SetSingleQueryData(
      queryClient,
      CHANNEL_COLLECTION_QUERY_KEY(channelId, collectionId),
      clientApiParams.locale,
      data.data
    );

    queryClient.invalidateQueries({
      queryKey: CHANNEL_COLLECTIONS_QUERY_KEY(channelId),
    });
  }

  return data;
};

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
