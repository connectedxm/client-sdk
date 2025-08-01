import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, PushDevice } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

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
  clientApiParams,
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
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfPushDevices>>
  >(
    SELF_PUSH_DEVICES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfPushDevices({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
