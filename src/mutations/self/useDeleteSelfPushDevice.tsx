import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Purchase } from "@context/interfaces";
import { QUERY_KEY as SELF_PUSH_DEVICES } from "@context/queries/self/useGetSelfPushDevices";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface DeleteSelfPushDeviceParams extends MutationParams {
  pushDeviceId: string;
}

export const DeleteSelfPushDevice = async ({
  pushDeviceId,
}: DeleteSelfPushDeviceParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/self/push-devices/${pushDeviceId}`
  );
  return data;
};

export const useDeleteSelfPushDevice = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<DeleteSelfPushDeviceParams>(
    (params: DeleteSelfPushDeviceParams) => DeleteSelfPushDevice({ ...params }),
    {
      onSuccess: (_response: ConnectedXMResponse<Purchase>) => {
        queryClient.invalidateQueries([SELF_PUSH_DEVICES]);
      },
    }
  );
};

export default useDeleteSelfPushDevice;
