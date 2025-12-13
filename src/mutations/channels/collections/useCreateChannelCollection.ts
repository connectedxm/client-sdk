import { ConnectedXMResponse, ChannelCollection } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_COLLECTIONS_QUERY_KEY } from "@src/queries/channels";
import { ChannelCollectionCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface CreateChannelCollectionParams extends MutationParams {
  channelId: string;
  collection: ChannelCollectionCreateInputs;
}

/**
 * @category Methods
 * @group Channels
 */
export const CreateChannelCollection = async ({
  channelId,
  collection,
  clientApiParams,
  queryClient,
}: CreateChannelCollectionParams): Promise<
  ConnectedXMResponse<ChannelCollection>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChannelCollection>>(
    `/channels/${channelId}/collections`,
    collection
  );

  if (queryClient && data.status === "ok") {
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
export const useCreateChannelCollection = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannelCollection>>,
      Omit<CreateChannelCollectionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelCollectionParams,
    Awaited<ReturnType<typeof CreateChannelCollection>>
  >(CreateChannelCollection, options);
};
