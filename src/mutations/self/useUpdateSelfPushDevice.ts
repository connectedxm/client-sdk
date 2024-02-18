import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, PushDevice } from "@src/interfaces";
import {
  SELF_PUSH_DEVICES_QUERY_KEY,
  SELF_PUSH_DEVICE_QUERY_KEY,
} from "@src/queries";

export interface UpdateSelfPushDeviceParams extends MutationParams {
  pushDeviceId: string;
  pushDevice: PushDevice;
}

export const UpdateSelfPushDevice = async ({
  pushDeviceId,
  pushDevice,
  clientApi,
  queryClient,
}: UpdateSelfPushDeviceParams): Promise<ConnectedXMResponse<PushDevice>> => {
  const { data } = await clientApi.put<ConnectedXMResponse<PushDevice>>(
    `/self/push-devices/${pushDeviceId}`,
    {
      pushDevice,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_PUSH_DEVICES_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_PUSH_DEVICE_QUERY_KEY(data.data.id),
    });
  }

  return data;
};

export const useUpdateSelfPushDevice = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfPushDevice>>,
      Omit<UpdateSelfPushDeviceParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfPushDeviceParams,
    Awaited<ReturnType<typeof UpdateSelfPushDevice>>
  >(UpdateSelfPushDevice, params, options);
};