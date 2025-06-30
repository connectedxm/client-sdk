import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENTS_QUERY_KEY } from "@src/queries";

export interface CreateChannelContentPayload {
  title: string;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface CreateChannelContentParams extends MutationParams {
  channelId: string;
  content: CreateChannelContentPayload;
}

export const CreateChannelContent = async ({
  channelId,
  content,
  clientApiParams,
  queryClient,
}: CreateChannelContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents`,
    content
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENTS_QUERY_KEY(channelId),
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
