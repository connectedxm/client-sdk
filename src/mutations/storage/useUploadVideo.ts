import { ConnectedXMResponse, BaseVideo } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface UploadVideoParams extends MutationParams {
  dataUri: string;
  name?: string;
}

export const UploadVideo = async ({
  clientApiParams,
  dataUri,
  name,
}: UploadVideoParams): Promise<ConnectedXMResponse<BaseVideo>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<BaseVideo>>(
    `/storage/videos`,
    {
      dataUri,
      name,
    }
  );

  return data;
};

export const useUploadVideo = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UploadVideo>>,
      Omit<UploadVideoParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UploadVideoParams,
    Awaited<ReturnType<typeof UploadVideo>>
  >(UploadVideo, options);
};
