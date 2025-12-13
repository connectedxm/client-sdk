import { ConnectedXMResponse, File } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { FileUploadInputs } from "@src/params";

/**
 * @category Params
 * @group Storage
 */
export interface UploadFileParams extends MutationParams {
  file: FileUploadInputs;
}

/**
 * @category Methods
 * @group Storage
 */
export const UploadFile = async ({
  file,
  clientApiParams,
}: UploadFileParams): Promise<ConnectedXMResponse<File>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<File>>(
    `/storage/files`,
    file
  );

  return data;
};

/**
 * @category Mutations
 * @group Storage
 */
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
