import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, PushDevice } from "@src/interfaces";
import {
  DEVICES_QUERY_KEY,
  DEVICE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Devices
 */
export interface UpdateDeviceParams extends MutationParams {
  deviceId: string;
  device: PushDevice;
}

/**
 * @category Methods
 * @group Devices
 */
export const UpdateDevice = async ({
  deviceId,
  device,
  clientApiParams,
  queryClient,
}: UpdateDeviceParams): Promise<ConnectedXMResponse<PushDevice>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<PushDevice>>(
    `/self/push-devices/${deviceId}`,
    {
      pushDevice: device,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: DEVICES_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: DEVICE_QUERY_KEY(data.data.id),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Devices
 */
export const useUpdateDevice = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateDevice>>,
      Omit<UpdateDeviceParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateDeviceParams,
    Awaited<ReturnType<typeof UpdateDevice>>
  >(UpdateDevice, options);
};
