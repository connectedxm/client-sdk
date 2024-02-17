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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateSelfImage>>,
    UpdateSelfImageParams
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfImageParams,
    Awaited<ConnectedXMResponse<Self>>
  >(UpdateSelfImage, params, options);
};
