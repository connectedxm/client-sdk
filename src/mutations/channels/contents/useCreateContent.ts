import { ConnectedXMResponse, ContentType, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_CONTENTS_QUERY_KEY } from "@src/queries";

export interface CreateContent {
  type: ContentType;
  visible: boolean;
  title?: string;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface CreateContentParams extends MutationParams {
  channelId: string;
  content: CreateContent;
}

export const CreateContent = async ({
  channelId,
  content,
  clientApiParams,
  queryClient,
}: CreateContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents`,
    content
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MANAGED_CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
  }

  return data;
};

export const useCreateContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateContent>>,
      Omit<CreateContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateContentParams,
    Awaited<ReturnType<typeof CreateContent>>
  >(CreateContent, options);
};
