import { ConnectedXMResponse, ContentType } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface CreateChannel {
  name: string;
  description?: string;
  visible: boolean;
}

export interface CreateChannelParams extends MutationParams {
  channel: CreateChannel;
  imageDataUri?: any;
}

export const CreateChannel = async ({
  channel,
  imageDataUri,
  clientApiParams,
}: CreateChannelParams): Promise<ConnectedXMResponse<ContentType>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ContentType>>(
    `/channels`,
    {
      channel,
      image: imageDataUri || undefined,
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
