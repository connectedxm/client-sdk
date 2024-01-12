import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Account } from "@interfaces";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACCOUNT_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "./useGetAccount";
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
  locale,
}: GetAccountFollowersProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/accounts/${accountId}/followers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetAccountFollowers = (accountId: string) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountFollowers>>
  >(
    ACCOUNT_FOLLOWERS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountFollowers({ accountId, ...params }),
    {
      enabled: !!token && !!accountId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (accountId) => [accountId],
          SET_ACCOUNT_QUERY_DATA
        ),
    }
  );
};

export default useGetAccountFollowers;
