import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, PushDevice } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { SELF_PUSH_DEVICE_QUERY_KEY } from "./useGetSelfPushDevice";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_PUSH_DEVICES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "PUSH_DEVICES",
];

export interface GetSelfPushDevicesProps extends InfiniteQueryParams {}

export const GetSelfPushDevices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetSelfPushDevicesProps): Promise<ConnectedXMResponse<PushDevice[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/push-devices`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (pushDeviceId) => SELF_PUSH_DEVICE_QUERY_KEY(pushDeviceId),
      locale
    );
  }

  return data;
};

export const useGetSelfPushDevices = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfPushDevices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfPushDevices>>
  >(
    SELF_PUSH_DEVICES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfPushDevices({ ...params }),
    params,
    {
      ...options,
    }
  );
};
