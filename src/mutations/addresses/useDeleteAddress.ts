import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ADDRESSES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Addresses
 */
export interface DeleteAddressParams extends MutationParams {
  addressId: string;
}

/**
 * @category Methods
 * @group Addresses
 */
export const DeleteAddress = async ({
  addressId,
  clientApiParams,
  queryClient,
}: DeleteAddressParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/addresses/${addressId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ADDRESSES_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Addresses
 */
export const useDeleteAddress = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteAddress>>,
      Omit<DeleteAddressParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAddressParams,
    Awaited<ReturnType<typeof DeleteAddress>>
  >(DeleteAddress, options);
};
