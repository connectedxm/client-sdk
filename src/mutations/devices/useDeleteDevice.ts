import { ConnectedXMResponse, PushDevice } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { DEVICES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Devices
 */
export interface DeleteDeviceParams extends MutationParams {
  deviceId: string;
}

/**
 * @category Methods
 * @group Devices
 */
export const DeleteDevice = async ({
  deviceId,
  clientApiParams,
  queryClient,
}: DeleteDeviceParams): Promise<ConnectedXMResponse<PushDevice>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<PushDevice>>(
    `/self/push-devices/${deviceId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: DEVICES_QUERY_KEY(),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Devices
 */
export const useDeleteDevice = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteDevice>>,
      Omit<DeleteDeviceParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteDeviceParams,
    Awaited<ReturnType<typeof DeleteDevice>>
  >(DeleteDevice, options);
};
