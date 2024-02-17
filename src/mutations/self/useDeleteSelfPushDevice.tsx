import { ConnectedXMResponse, PushDevice } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_PUSH_DEVICES_QUERY_KEY } from "@src/queries";

export interface DeleteSelfPushDeviceParams extends MutationParams {
  pushDeviceId: string;
}

export const DeleteSelfPushDevice = async ({
  pushDeviceId,
  clientApi,
  queryClient,
}: DeleteSelfPushDeviceParams): Promise<ConnectedXMResponse<PushDevice>> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<PushDevice>>(
    `/self/push-devices/${pushDeviceId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_PUSH_DEVICES_QUERY_KEY(),
    });
  }
  return data;
};

export const useDeleteSelfPushDevice = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof DeleteSelfPushDevice>>,
    DeleteSelfPushDeviceParams
  >
) => {
  return useConnectedMutation<
    DeleteSelfPushDeviceParams,
    Awaited<ReturnType<typeof DeleteSelfPushDevice>>
  >(DeleteSelfPushDevice, params, options);
};
