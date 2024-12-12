import { GetClientAPI } from "@src/ClientAPI";
import { AccountAddress, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_ADDRESSES_QUERY_KEY } from "@src/queries";

export interface CreateSelfAddressParams extends MutationParams {
  address: any;
}

export const CreateSelfAddress = async ({
  address,
  clientApiParams,
  queryClient,
}: CreateSelfAddressParams): Promise<ConnectedXMResponse<AccountAddress>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<AccountAddress>>(
    `/self/addresses`,
    address
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_ADDRESSES_QUERY_KEY(),
    });
  }

  return data;
};

export const useCreateSelfAddress = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfAddress>>,
      Omit<CreateSelfAddressParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfAddressParams,
    Awaited<ReturnType<typeof CreateSelfAddress>>
  >(CreateSelfAddress, options);
};
