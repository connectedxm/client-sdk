import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENT_QUERY_KEY,
  CHANNEL_CONTENTS_QUERY_KEY,
  MANAGED_CHANNEL_CONTENT_QUERY_KEY,
  MANAGED_CHANNEL_CONTENTS_QUERY_KEY,
} from "@src/queries";
import { CONTENT_QUERY_KEY } from "@src/queries/contents/useGetContent";
import { CONTENTS_QUERY_KEY } from "@src/queries/contents/useGetContents";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface UpdateChannelContentInput {
  visible?: boolean;
  title?: string;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  editor?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  videoId?: string | null;
  audioId?: number | null;
  slug?: string;
  email?: boolean;
  push?: boolean;
}

export interface UpdateChannelContentParams extends MutationParams {
  channelId: string;
  contentId: string;
  content: UpdateChannelContentInput;
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
    `/channels/managed/${channelId}/contents/${contentId}`,
    {
      content,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SetSingleQueryData(
      queryClient,
      MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
      clientApiParams.locale,
      data.data
    );

    SetSingleQueryData(
      queryClient,
      CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
      clientApiParams.locale,
      data.data
    );

    SetSingleQueryData(
      queryClient,
      CONTENT_QUERY_KEY(contentId),
      clientApiParams.locale,
      data.data
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
