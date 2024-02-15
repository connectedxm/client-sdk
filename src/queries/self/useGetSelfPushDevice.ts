import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { ConnectedXMResponse, PushDevice } from "@interfaces";
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
  clientApi,
}: GetSelfPushDeviceProps): Promise<ConnectedXMResponse<PushDevice>> => {
  const { data } = await clientApi.get(`/self/push-devices/${pushDeviceId}`);
  return data;
};

export const useGetSelfPushDevice = (
  pushDeviceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfPushDevice>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfPushDevice>>(
    SELF_PUSH_DEVICE_QUERY_KEY(pushDeviceId),
    (params) => GetSelfPushDevice({ pushDeviceId, ...params }),
    {
      ...options,
      enabled: !!token && !!pushDeviceId && (options?.enabled ?? true),
    }
  );
};
