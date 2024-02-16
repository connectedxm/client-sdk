import { Account, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ACCOUNT_QUERY_KEY } from "../accounts/useGetAccount";
import { useConnectedXM } from "@src/hooks";
import { QueryKey } from "@tanstack/react-query";

export const SELF_DELEGATE_OF_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "DELEGATE_OF",
];

interface GetSelfDelegateOfProps extends InfiniteQueryParams {}

export const GetSelfDelegateOf = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetSelfDelegateOfProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/self/delegateof`, {
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
      (accountId) => ACCOUNT_QUERY_KEY(accountId),
      locale
    );
  }

  return data;
};

export const useGetSelfDelegateOf = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfDelegateOf>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfDelegateOf>>
  >(
    SELF_DELEGATE_OF_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfDelegateOf({ ...params }),
    params,
    {
      ...options,
      enabled: !!token,
    }
  );
};
