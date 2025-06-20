import { Channel } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const MANAGED_CHANNELS_QUERY_KEY = (): QueryKey => [
  "CHANNELS",
  "MANAGED",
];

export const SET_MANAGED_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MANAGED_CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetManagedChannels>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...MANAGED_CHANNELS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetManagedChannelsParams extends InfiniteQueryParams {}

export const GetManagedChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetManagedChannelsParams): Promise<ConnectedXMResponse<Channel[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/managed`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetManagedChannels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannels>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannels>>
  >(
    MANAGED_CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetManagedChannels({ ...params }),
    params,
    options
  );
};
