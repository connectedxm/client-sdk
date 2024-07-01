import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_COLLECTION_CONTENTS_QUERY_KEY } from "@src/queries/channels";

export interface AddChannelCollectionContentParams extends MutationParams {
  channelId: string;
  collectionId: string;
  contentId: string;
  imageDataUri?: any;
}

export const AddChannelCollectionContent = async ({
  channelId,
  collectionId,
  contentId,
  clientApiParams,
  queryClient,
}: AddChannelCollectionContentParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/channels/${channelId}/collections/${collectionId}/contents/${contentId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_COLLECTION_CONTENTS_QUERY_KEY(channelId, collectionId),
    });
  }

  return data;
};

export const useAddChannelCollectionContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddChannelCollectionContent>>,
      Omit<AddChannelCollectionContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddChannelCollectionContentParams,
    Awaited<ReturnType<typeof AddChannelCollectionContent>>
  >(AddChannelCollectionContent, options);
};
