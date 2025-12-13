import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, PushDevice } from "@interfaces";
import { SELF_QUERY_KEY } from "../self/useGetSelf";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const DEVICES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "DEVICES",
];

export interface GetDevicesProps extends InfiniteQueryParams {}

export const GetDevices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetDevicesProps): Promise<ConnectedXMResponse<PushDevice[]>> => {
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

export const useGetDevices = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetDevices>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetDevices>>
  >(
    DEVICES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetDevices({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
