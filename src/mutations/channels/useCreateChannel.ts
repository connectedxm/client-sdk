import { ConnectedXMResponse, Channel } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface CreateChannel {
  name: string;
  description?: string;
  visible: boolean;
  groupId?: string;
}

export interface CreateChannelParams extends MutationParams {
  channel: CreateChannel;
  imageDataUri?: any;
}

export const CreateChannel = async ({
  channel,
  imageDataUri,
  clientApiParams,
}: CreateChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Channel>>(
    `/channels`,
    {
      channel,
      imageDataUri: imageDataUri || undefined,
    }
  );

  return data;
};

export const useCreateChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannel>>,
      Omit<CreateChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelParams,
    Awaited<ReturnType<typeof CreateChannel>>
  >(CreateChannel, options);
};
