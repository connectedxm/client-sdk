import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import type { ConnectedXMResponse, PushDevice } from "@interfaces";
import { SELF_PUSH_DEVICES_QUERY_KEY } from "./useGetSelfPushDevices";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_PUSH_DEVICE_QUERY_KEY = (pushDeviceId: string): QueryKey => [
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
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfPushDevice>>(
    SELF_PUSH_DEVICE_QUERY_KEY(pushDeviceId),
    (params) => GetSelfPushDevice({ pushDeviceId, ...params }),
    {
      ...options,
      enabled: !!authenticated && !!pushDeviceId && (options?.enabled ?? true),
    }
  );
};
