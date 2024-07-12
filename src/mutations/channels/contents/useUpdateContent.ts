import { ConnectedXMResponse, ContentType, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENTS_QUERY_KEY,
  CONTENTS_QUERY_KEY,
  MANAGED_CHANNEL_CONTENTS_QUERY_KEY,
  SET_CONTENT_QUERY_DATA,
  SET_MANAGED_CHANNEL_CONTENT_QUERY_DATA,
} from "@src/queries";

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
  videoId?: string | null;
  audioId?: number | null;
  slug?: string;
}

export interface UpdateContentParams extends MutationParams {
  channelId: string;
  contentId: string;
  content: UpdateContent;
  imageDataUri?: string;
}

export const UpdateContent = async ({
  channelId,
  contentId,
  content,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}`,
    {
      content,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_CONTENT_QUERY_DATA(queryClient, [contentId], data, [
      clientApiParams.locale,
    ]);
    SET_MANAGED_CHANNEL_CONTENT_QUERY_DATA(
      queryClient,
      [channelId, contentId],
      data,
      [clientApiParams.locale]
    );
    queryClient.invalidateQueries({
      queryKey: MANAGED_CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
    queryClient.invalidateQueries({
      queryKey: CONTENTS_QUERY_KEY(),
    });
  }

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
