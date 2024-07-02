import { ConnectedXMResponse, ChannelCollection } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_COLLECTION_QUERY_KEY,
  CHANNEL_COLLECTIONS_QUERY_KEY,
} from "@src/queries/channels";

export interface DeleteChannelCollectionParams extends MutationParams {
  channelId: string;
  collectionId: string;
}

export const DeleteChannelCollection = async ({
  channelId,
  collectionId,
  clientApiParams,
  queryClient,
}: DeleteChannelCollectionParams): Promise<
  ConnectedXMResponse<ChannelCollection>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChannelCollection>>(
    `/channels/${channelId}/collections/${collectionId}`
  );

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
