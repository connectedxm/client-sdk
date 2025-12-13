import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENTS_QUERY_KEY,
  SET_CHANNEL_CONTENT_QUERY_DATA,
} from "@src/queries";
import { CONTENTS_QUERY_KEY } from "@src/queries/contents";
import { ChannelContentUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface UpdateChannelContentParams extends MutationParams {
  channelId: string;
  contentId: string;
  content: ChannelContentUpdateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Channels
 */
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
    SET_CHANNEL_CONTENT_QUERY_DATA(queryClient, [channelId, contentId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
    queryClient.invalidateQueries({
      queryKey: CONTENTS_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
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
