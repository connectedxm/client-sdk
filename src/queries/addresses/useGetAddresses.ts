import type { AccountAddress, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { SELF_QUERY_KEY } from "../self/useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const ADDRESSES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "ADDRESSES",
];

export interface GetAddressesProps extends InfiniteQueryParams {}

export const GetAddresses = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetAddressesProps): Promise<ConnectedXMResponse<AccountAddress[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/addresses`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetAddresses = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAddresses>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAddresses>>
  >(
    ADDRESSES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetAddresses({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
