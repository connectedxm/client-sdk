import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_CONTENTS_QUERY_KEY } from "@src/queries";
import { ChannelContentCreateInputs } from "@src/params";

export interface CreateChannelContentParams extends MutationParams {
  channelId: string;
  content: ChannelContentCreateInputs;
}

export const CreateChannelContent = async ({
  channelId,
  content,
  clientApiParams,
  queryClient,
}: CreateChannelContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/managed/${channelId}/contents`,
    content
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MANAGED_CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
  }

  return data;
};

export const useCreateChannelContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannelContent>>,
      Omit<CreateChannelContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelContentParams,
    Awaited<ReturnType<typeof CreateChannelContent>>
  >(CreateChannelContent, options);
};
