import { ConnectedXMResponse, Self } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateSelfBannerParams extends MutationParams {
  base64: string;
}

export const UpdateSelfBanner = async ({
  base64,
  clientApiParams,
  queryClient,
}: UpdateSelfBannerParams): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Self>>(
    `/self/banner`,
    {
      buffer: base64,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.refetchQueries({ queryKey: SELF_QUERY_KEY() });
  }

  return data;
};

export const useUpdateSelfBanner = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfBanner>>,
      Omit<UpdateSelfBannerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfBannerParams,
    Awaited<ConnectedXMResponse<Self>>
  >(UpdateSelfBanner, options);
};
