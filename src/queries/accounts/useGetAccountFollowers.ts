import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Account } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";

export const ACCOUNT_FOLLOWERS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "FOLLOWERS",
];

export const SET_ACCOUNT_FOLLOWERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_FOLLOWERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountFollowers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_FOLLOWERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetAccountFollowersProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountFollowers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  queryClient,
  clientApi,
  locale,
}: GetAccountFollowersProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/accounts/${accountId}/followers`, {
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

export const useGetAccountFollowers = (
  accountId: string,
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountFollowers>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountFollowers>>
  >(
    ACCOUNT_FOLLOWERS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountFollowers({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!accountId && (options?.enabled ?? true),
    }
  );
};
