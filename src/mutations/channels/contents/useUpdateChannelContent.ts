import { ConnectedXMResponse, ContentType, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENTS_QUERY_KEY,
  MANAGED_CHANNEL_CONTENTS_QUERY_KEY,
  SET_CHANNEL_CONTENT_QUERY_DATA,
  SET_MANAGED_CHANNEL_CONTENT_QUERY_DATA,
} from "@src/queries";
import { SET_CONTENT_QUERY_DATA } from "@src/queries/contents/useGetContent";
import { CONTENTS_QUERY_KEY } from "@src/queries/contents/useGetContents";

export interface UpdateChannelContent {
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

export interface UpdateChannelContentParams extends MutationParams {
  channelId: string;
  contentId: string;
  content: UpdateChannelContent;
  imageDataUri?: string;
}

export const UpdateChannelContent = async ({
  channelId,
  contentId,
  content,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateChannelContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}`,
    {
      content,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_MANAGED_CHANNEL_CONTENT_QUERY_DATA(
      queryClient,
      [channelId, contentId],
      data,
      [clientApiParams.locale]
    );
    SET_CHANNEL_CONTENT_QUERY_DATA(queryClient, [channelId, contentId], data, [
      clientApiParams.locale,
    ]);
    SET_CONTENT_QUERY_DATA(queryClient, [contentId], data, [
      clientApiParams.locale,
    ]);
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

export const useUpdateChannelContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateChannelContent>>,
      Omit<UpdateChannelContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelContentParams,
    Awaited<ReturnType<typeof UpdateChannelContent>>
  >(UpdateChannelContent, options);
};
