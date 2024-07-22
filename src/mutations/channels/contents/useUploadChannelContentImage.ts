import { ConnectedXMResponse, Image } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface UploadChannelContentImageParams extends MutationParams {
  channelId: string;
  contentId: string;
  imageDataUri: string;
  filename?: string;
}

export const UploadChannelContentImage = async ({
  channelId,
  contentId,
  imageDataUri,
  filename,
  clientApiParams,
}: UploadChannelContentImageParams): Promise<ConnectedXMResponse<Image>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Image>>(
    `/channels/${channelId}/contents/${contentId}/image`,
    {
      imageDataUri,
      filename,
    }
  );

  return data;
};

export const useUploadChannelContentImage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UploadChannelContentImage>>,
      Omit<UploadChannelContentImageParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UploadChannelContentImageParams,
    Awaited<ReturnType<typeof UploadChannelContentImage>>
  >(UploadChannelContentImage, options);
};
