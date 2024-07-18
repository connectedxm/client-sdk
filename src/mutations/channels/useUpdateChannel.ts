import { ConnectedXMResponse, Channel } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { SET_CHANNEL_QUERY_DATA } from "@src/queries";

export interface UpdateChannel {
  name?: string;
  description?: string;
  visible?: boolean;
  slug?: string;
  groupId?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface UpdateChannelParams extends MutationParams {
  channelId: string;
  channel: UpdateChannel;
  imageDataUri?: any;
}

export const UpdateChannel = async ({
  channelId,
  channel,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Channel>>(
    `/channels/${channelId}`,
    {
      channel,
      imageDataUri: imageDataUri || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_CHANNEL_QUERY_DATA(queryClient, [channelId], data);
  }

  return data;
};

export const useUpdateChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateChannel>>,
      Omit<UpdateChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelParams,
    Awaited<ReturnType<typeof UpdateChannel>>
  >(UpdateChannel, options);
};
