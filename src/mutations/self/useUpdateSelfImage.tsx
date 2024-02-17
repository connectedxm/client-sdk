import { ConnectedXMResponse, Self } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_QUERY_KEY } from "@src/queries";

export interface UpdateSelfImageParams extends MutationParams {
  base64: string;
}

export const UpdateSelfImage = async ({
  base64,
  clientApi,
  queryClient,
}: UpdateSelfImageParams): Promise<ConnectedXMResponse<Self>> => {
  const { data } = await clientApi.put<ConnectedXMResponse<Self>>(
    `/self/image`,
    {
      buffer: `data:image/jpeg;base64,${base64}`,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_QUERY_KEY() });
  }

  return data;
};

export const useUpdateSelfImage = (
  options: MutationOptions<
    Awaited<ConnectedXMResponse<Self>>,
    UpdateSelfImageParams
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfImageParams,
    Awaited<ConnectedXMResponse<Self>>
  >((params) => UpdateSelfImage({ ...params }), options);
};
