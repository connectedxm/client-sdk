import { ConnectedXMResponse, Self } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Self
 */
export interface UpdateSelfImageParams extends MutationParams {
  base64: string;
}

/**
 * @category Methods
 * @group Self
 */
export const UpdateSelfImage = async ({
  base64,
  clientApiParams,
  queryClient,
}: UpdateSelfImageParams): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Self>>(
    `/self/image`,
    {
      buffer: base64,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.refetchQueries({ queryKey: SELF_QUERY_KEY() });
  }

  return data;
};

/**
 * @category Mutations
 * @group Self
 */
export const useUpdateSelfImage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfImage>>,
      Omit<UpdateSelfImageParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfImageParams,
    Awaited<ConnectedXMResponse<Self>>
  >(UpdateSelfImage, options);
};
