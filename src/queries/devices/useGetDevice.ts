import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import type { ConnectedXMResponse, PushDevice } from "@interfaces";
import { DEVICES_QUERY_KEY } from "./useGetDevices";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const DEVICE_QUERY_KEY = (deviceId: string): QueryKey => [
  ...DEVICES_QUERY_KEY(),
  deviceId,
];

export const SET_DEVICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof DEVICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetDevice>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...DEVICE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetDeviceProps extends SingleQueryParams {
  deviceId: string;
}

export const GetDevice = async ({
  deviceId,
  clientApiParams,
}: GetDeviceProps): Promise<ConnectedXMResponse<PushDevice>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/push-devices/${deviceId}`);
  return data;
};

export const useGetDevice = (
  deviceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetDevice>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetDevice>>(
    DEVICE_QUERY_KEY(deviceId),
    (params) => GetDevice({ deviceId, ...params }),
    {
      ...options,
      enabled: !!authenticated && !!deviceId && (options?.enabled ?? true),
    }
  );
};
