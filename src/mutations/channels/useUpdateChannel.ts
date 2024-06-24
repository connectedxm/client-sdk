import { ConnectedXMResponse, Channel } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateChannel {
  name?: string;
  description?: string;
  visible?: boolean;
  slug?: string;
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
}: UpdateChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Channel>>(
    `/channels/${channelId}`,
    {
      channel,
      image: imageDataUri || undefined,
    }
  );

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
