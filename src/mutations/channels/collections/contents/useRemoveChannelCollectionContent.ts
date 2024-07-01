import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_COLLECTION_CONTENTS_QUERY_KEY } from "@src/queries/channels";

export interface RemoveChannelCollectionContentParams extends MutationParams {
  channelId: string;
  collectionId: string;
  contentId: string;
  imageDataUri?: any;
}

export const RemoveChannelCollectionContent = async ({
  channelId,
  collectionId,
  contentId,
  clientApiParams,
  queryClient,
}: RemoveChannelCollectionContentParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/collections/${collectionId}/contents/${contentId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_COLLECTION_CONTENTS_QUERY_KEY(channelId, collectionId),
    });
  }

  return data;
};

export const useRemoveChannelCollectionContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveChannelCollectionContent>>,
      Omit<
        RemoveChannelCollectionContentParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveChannelCollectionContentParams,
    Awaited<ReturnType<typeof RemoveChannelCollectionContent>>
  >(RemoveChannelCollectionContent, options);
};
