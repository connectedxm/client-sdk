import { ConnectedXMResponse, PushDevice } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_PUSH_DEVICES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteSelfPushDeviceParams extends MutationParams {
  pushDeviceId: string;
}

export const DeleteSelfPushDevice = async ({
  pushDeviceId,
  clientApiParams,
  queryClient,
}: DeleteSelfPushDeviceParams): Promise<ConnectedXMResponse<PushDevice>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelfPushDevice>>,
      Omit<DeleteSelfPushDeviceParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfPushDeviceParams,
    Awaited<ReturnType<typeof DeleteSelfPushDevice>>
  >(DeleteSelfPushDevice, options);
};
