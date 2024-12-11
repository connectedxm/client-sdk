import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { AccountAddress, ConnectedXMResponse } from "@src/interfaces";
import { SELF_ADDRESS_QUERY_KEY, SELF_ADDRESSES_QUERY_KEY } from "@src/queries";

export interface UpdateSelfAddressParams extends MutationParams {
  addressId: string;
  address: any;
}

export const UpdateSelfAddress = async ({
  addressId,
  address,
  queryClient,
  clientApiParams,
}: UpdateSelfAddressParams): Promise<ConnectedXMResponse<AccountAddress>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<AccountAddress>>(
    `/self/addresses/${addressId}`,
    address
  );

  // TO DO: Update invalidate query - we don't have a getter yet so we don't have a query key
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_ADDRESSES_QUERY_KEY() });
    queryClient.invalidateQueries({
      queryKey: SELF_ADDRESS_QUERY_KEY(addressId),
    });
  }

  return data;
};

export const useUpdateSelfAddress = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfAddress>>,
      Omit<UpdateSelfAddressParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfAddressParams,
    Awaited<ReturnType<typeof UpdateSelfAddress>>
  >(UpdateSelfAddress, options);
};
