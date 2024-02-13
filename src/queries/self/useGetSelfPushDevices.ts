import { useConnectedXM } from "@src/hooks/useConnectedXM";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, PushDevice } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import {
  SELF_PUSH_DEVICE_QUERY_KEY,
  SET_PUSH_DEVICE_QUERY_DATA,
} from "./useGetSelfPushDevice";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";

export const SELF_PUSH_DEVICES_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "PUSH_DEVICES",
];

interface GetSelfPushDevicesProps extends InfiniteQueryParams {}

export const GetSelfPushDevices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
}: GetSelfPushDevicesProps): Promise<ConnectedXMResponse<PushDevice[]>> => {
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
      SET_PUSH_DEVICE_QUERY_DATA
    );
  }

  return data;
};

const useGetSelfPushDevices = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetSelfPushDevices>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetSelfPushDevices>>(
    SELF_PUSH_DEVICES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfPushDevices({ ...params }),
    params,
    {
      ...options,
      enabled: !!token,
    }
  );
};

export default useGetSelfPushDevices;
