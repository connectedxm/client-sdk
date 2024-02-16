import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Purchase, PushDevice } from "@context/interfaces";
import { QUERY_KEY as SELF_PUSH_DEVICES } from "@context/queries/self/useGetSelfPushDevices";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UpdateSelfPushDeviceParams extends MutationParams {
  pushDeviceId: string;
  pushDevice: PushDevice;
}

export const UpdateSelfPushDevice = async ({
  pushDeviceId,
  pushDevice,
}: UpdateSelfPushDeviceParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/self/push-devices/${pushDeviceId}`, {
    pushDevice,
  });
  return data;
};

export const useUpdateSelfPushDevice = (pushDeviceId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfPushDeviceParams>(
    (params: UpdateSelfPushDeviceParams) =>
      UpdateSelfPushDevice({ ...params, pushDeviceId }),
    {
      onSuccess: (_response: ConnectedXMResponse<Purchase>) => {
        queryClient.invalidateQueries([SELF_PUSH_DEVICES]);
      },
    },
  );
};

export default useUpdateSelfPushDevice;
