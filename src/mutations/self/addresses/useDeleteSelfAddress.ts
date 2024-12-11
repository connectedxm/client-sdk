import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { SELF_ADDRESSES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteSelfAddressParams extends MutationParams {
  addressId: string;
}

export const DeleteSelfAddress = async ({
  addressId,
  clientApiParams,
  queryClient,
}: DeleteSelfAddressParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/addresses/${addressId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_ADDRESSES_QUERY_KEY(),
    });
  }

  return data;
};

export const useDeleteSelfAddress = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelfAddress>>,
      Omit<DeleteSelfAddressParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfAddressParams,
    Awaited<ReturnType<typeof DeleteSelfAddress>>
  >(DeleteSelfAddress, options);
};
