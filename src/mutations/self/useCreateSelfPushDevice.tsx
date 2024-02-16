import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { PushDevice } from "@context/interfaces";
import { QUERY_KEY as SELF_PUSH_DEVICE } from "@context/queries/self/useGetSelfPushDevice";
import { QUERY_KEY as SELF_PUSH_DEVICES } from "@context/queries/self/useGetSelfPushDevices";
import { env } from "@env";
import { useQueryClient } from "@tanstack/react-query";
import * as Device from "expo-device";
import { Platform } from "react-native";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export type AppType = "EVENTXM" | "COMMUNITYXM";

interface CreateSelfPushDeviceParams extends MutationParams {
  expoToken: string;
  deviceToken: string;
  appType: AppType;
  eventId?: string;
}

export const CreateSelfPushDevice = async ({
  expoToken,
  deviceToken,
  eventId,
  appType,
}: CreateSelfPushDeviceParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(`/self/push-devices`, {
    id: expoToken,
    deviceToken,
    eventId,
    name: Device.deviceName,
    model: Device.modelName,
    brand: Device.brand,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceYearClass: Device.deviceYearClass,
    manufacturer: Device.manufacturer,
    supportedCpuArchitectures: Device.supportedCpuArchitectures?.join(","),
    // totalMemory: Device.totalMemory,
    appType,
    pushService: Platform.OS === "ios" ? "apn" : "firebase",
    pushServiceName: env.SLUG,
    bundleId: env.BUNDLE_ID,
  });
  return data;
};

export const useCreateSelfPushDevice = (appType: AppType, eventId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (params: Omit<CreateSelfPushDeviceParams, "appType" | "eventId">) =>
      CreateSelfPushDevice({ ...params, appType, eventId }),
    {
      onSuccess: (response: ConnectedXMResponse<PushDevice>) => {
        queryClient.invalidateQueries([SELF_PUSH_DEVICE, response.data.id]);
        queryClient.invalidateQueries([SELF_PUSH_DEVICES]);
      },
    }
  );
};

export default useCreateSelfPushDevice;
