import { ConnectedXMResponse, File } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface UploadFileParams extends MutationParams {
  dataUri: string;
  name?: string;
}

export const UploadFile = async ({
  clientApiParams,
  dataUri,
  name,
}: UploadFileParams): Promise<ConnectedXMResponse<File>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<File>>(
    `/storage/files`,
    {
      dataUri,
      name,
    }
  );

  return data;
};

export const useUploadFile = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UploadFile>>,
      Omit<UploadFileParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UploadFileParams,
    Awaited<ReturnType<typeof UploadFile>>
  >(UploadFile, options);
};
