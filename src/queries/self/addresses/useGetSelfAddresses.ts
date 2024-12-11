import type { AccountAddress, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_ADDRESS_QUERY_KEY } from "./useGetSelfAddress";

export const SELF_ADDRESSES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "ADDRESSES",
];

export interface GetSelfAddressesProps extends InfiniteQueryParams {}

export const GetSelfAddresses = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetSelfAddressesProps): Promise<ConnectedXMResponse<AccountAddress[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/addresses`, {
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
      (activityId) => SELF_ADDRESS_QUERY_KEY(activityId),
      locale
    );
  }

  return data;
};

export const useGetSelfAddresses = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfAddresses>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfAddresses>>
  >(
    SELF_ADDRESSES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfAddresses({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
