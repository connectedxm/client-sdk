import { ConnectedXMResponse, Self } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SelfUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Self
 */
export interface UpdateSelfParams extends MutationParams {
  self: SelfUpdateInputs;
}

/**
 * @category Methods
 * @group Self
 */
export const UpdateSelf = async ({
  self,
  clientApiParams,
  queryClient,
}: UpdateSelfParams): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.put<ConnectedXMResponse<Self>>(
    `/self`,
    self
  );

  if (queryClient && data.status !== "ok") {
    queryClient.refetchQueries({ queryKey: SELF_QUERY_KEY() });
  }

  return data;
};

/**
 * @category Mutations
 * @group Self
 */
export const useUpdateSelf = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelf>>,
      Omit<UpdateSelfParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfParams,
    Awaited<ReturnType<typeof UpdateSelf>>
  >(UpdateSelf, options);
};
