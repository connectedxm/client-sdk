import { ConnectedXMResponse, ContentType, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateContent {
  type?: ContentType;
  visible?: boolean;
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

export interface UpdateContentParams extends MutationParams {
  channelId: string;
  contentId: string;
  content: UpdateContent;
}

export const UpdateContent = async ({
  channelId,
  contentId,
  content,
  clientApiParams,
}: UpdateContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}`,
    content
  );

  return data;
};

export const useUpdateContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateContent>>,
      Omit<UpdateContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateContentParams,
    Awaited<ReturnType<typeof UpdateContent>>
  >(UpdateContent, options);
};
