import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { PushDevice } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_PUSH_DEVICE_QUERY_DATA } from "@context/queries/self/useGetSelfPushDevice";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SELF_QUERY_KEY } from "./useGetSelf";

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
  locale,
}: GetSelfPushDevicesProps): Promise<ConnectedXMResponse<PushDevice[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/push-devices`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSelfPushDevices = () => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfPushDevices>>
  >(
    SELF_PUSH_DEVICES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfPushDevices({ ...params }),
    {
      enabled: !!token,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (pushDeviceId) => [pushDeviceId],
          SET_PUSH_DEVICE_QUERY_DATA
        ),
    }
  );
};

export default useGetSelfPushDevices;
