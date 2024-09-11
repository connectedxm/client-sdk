import { ConnectedXMResponse, ChannelCollection } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_COLLECTIONS_QUERY_KEY } from "@src/queries/channels";

export interface CreateChannelCollection {
  name: string;
  description?: string;
}

export interface CreateChannelCollectionParams extends MutationParams {
  channelId: string;
  collection: CreateChannelCollection;
}

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
    `/channels/managed/${channelId}/collections`,
    collection
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_COLLECTIONS_QUERY_KEY(channelId),
    });
  }

  return data;
};

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
