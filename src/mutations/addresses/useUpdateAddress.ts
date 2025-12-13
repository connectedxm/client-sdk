import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { AccountAddress, ConnectedXMResponse } from "@src/interfaces";
import { ADDRESS_QUERY_KEY, ADDRESSES_QUERY_KEY } from "@src/queries";
import { AddressUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Addresses
 */
export interface UpdateAddressParams extends MutationParams {
  addressId: string;
  address: AddressUpdateInputs;
}

/**
 * @category Methods
 * @group Addresses
 */
export const UpdateAddress = async ({
  addressId,
  address,
  queryClient,
  clientApiParams,
}: UpdateAddressParams): Promise<ConnectedXMResponse<AccountAddress>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<AccountAddress>>(
    `/self/addresses/${addressId}`,
    address
  );

  // TO DO: Update invalidate query - we don't have a getter yet so we don't have a query key
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY() });
    queryClient.invalidateQueries({
      queryKey: ADDRESS_QUERY_KEY(addressId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Addresses
 */
export const useUpdateAddress = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateAddress>>,
      Omit<UpdateAddressParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAddressParams,
    Awaited<ReturnType<typeof UpdateAddress>>
  >(UpdateAddress, options);
};
