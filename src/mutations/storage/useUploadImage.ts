import { ConnectedXMResponse, BaseVideo } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

interface ImageCreateParams {
  type: "activity" | "thread" | "content";
  dataUri: string;
  name?: string;
  description?: string;
}

export interface UploadImageParams extends MutationParams {
  image: ImageCreateParams;
}

export const UploadImage = async ({
  image,
  clientApiParams,
}: UploadImageParams): Promise<ConnectedXMResponse<BaseVideo>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<BaseVideo>>(
    `/storage/images/upload`,
    image
  );

  return data;
};

export const useUploadImage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UploadImage>>,
      Omit<UploadImageParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UploadImageParams,
    Awaited<ReturnType<typeof UploadImage>>
  >(UploadImage, options);
};
