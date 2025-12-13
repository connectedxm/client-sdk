import { GetClientAPI } from "@src/ClientAPI";
import { AccountAddress, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ADDRESSES_QUERY_KEY } from "@src/queries";
import { AddressCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Addresses
 */
export interface CreateAddressParams extends MutationParams {
  address: AddressCreateInputs;
}

/**
 * @category Methods
 * @group Addresses
 */
export const CreateAddress = async ({
  address,
  clientApiParams,
  queryClient,
}: CreateAddressParams): Promise<ConnectedXMResponse<AccountAddress>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<AccountAddress>>(
    `/self/addresses`,
    address
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
export const useCreateAddress = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateAddress>>,
      Omit<CreateAddressParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAddressParams,
    Awaited<ReturnType<typeof CreateAddress>>
  >(CreateAddress, options);
};
