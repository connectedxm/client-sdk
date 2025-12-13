import { ConnectedXMResponse, BaseImage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { ImageCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Storage
 */
export interface UploadImageParams extends MutationParams {
  image: ImageCreateInputs;
}

/**
 * @category Methods
 * @group Storage
 */
export const UploadImage = async ({
  image,
  clientApiParams,
}: UploadImageParams): Promise<ConnectedXMResponse<BaseImage>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<BaseImage>>(
    `/storage/images/upload`,
    image
  );

  return data;
};

/**
 * @category Mutations
 * @group Storage
 */
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
