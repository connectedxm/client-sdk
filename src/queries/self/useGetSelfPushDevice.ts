import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { PushDevice } from "@interfaces";
import { SELF_PUSH_DEVICES_QUERY_KEY } from "./useGetSelfPushDevices";
import { QueryClient } from "@tanstack/react-query";

export const SELF_PUSH_DEVICE_QUERY_KEY = (pushDeviceId: string) => [
  ...SELF_PUSH_DEVICES_QUERY_KEY(),
  pushDeviceId,
];

export const SET_PUSH_DEVICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_PUSH_DEVICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfPushDevice>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_PUSH_DEVICE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetSelfPushDeviceProps extends SingleQueryParams {
  pushDeviceId: string;
}

export const GetSelfPushDevice = async ({
  pushDeviceId,
  locale,
}: GetSelfPushDeviceProps): Promise<ConnectedXMResponse<PushDevice>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/push-devices/${pushDeviceId}`);
  return data;
};

const useGetSelfPushDevice = (pushDeviceId: string = "") => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<Awaited<ReturnType<typeof GetSelfPushDevice>>>(
    SELF_PUSH_DEVICE_QUERY_KEY(pushDeviceId),
    (params) => GetSelfPushDevice({ pushDeviceId, ...params }),
    {
      enabled: !!token && !!pushDeviceId,
    }
  );
};

export default useGetSelfPushDevice;
