import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import type { ConnectedXMResponse, PushDevice } from "@interfaces";
import { SELF_PUSH_DEVICES_QUERY_KEY } from "./useGetSelfPushDevices";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_PUSH_DEVICE_QUERY_KEY = (pushDeviceId: string): QueryKey => [
  ...SELF_PUSH_DEVICES_QUERY_KEY(),
  pushDeviceId,
];

export interface GetSelfPushDeviceProps extends SingleQueryParams {
  pushDeviceId: string;
}

export const GetSelfPushDevice = async ({
  pushDeviceId,
  clientApiParams,
}: GetSelfPushDeviceProps): Promise<ConnectedXMResponse<PushDevice>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/push-devices/${pushDeviceId}`);
  return data;
};

export const useGetSelfPushDevice = (
  pushDeviceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfPushDevice>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfPushDevice>>(
    SELF_PUSH_DEVICE_QUERY_KEY(pushDeviceId),
    (params) => GetSelfPushDevice({ pushDeviceId, ...params }),
    {
      ...options,
      enabled: !!authenticated && !!pushDeviceId && (options?.enabled ?? true),
    }
  );
};
