import { ConnectedXMResponse, Self } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SelfBannerUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Self
 */
export interface UpdateSelfBannerParams extends MutationParams {
  banner: SelfBannerUpdateInputs;
}

/**
 * @category Methods
 * @group Self
 */
export const UpdateSelfBanner = async ({
  banner,
  clientApiParams,
  queryClient,
}: UpdateSelfBannerParams): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Self>>(
    `/self/banner`,
    {
      buffer: banner.base64,
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
