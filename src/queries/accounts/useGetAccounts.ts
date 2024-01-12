import { ClientAPI } from "@src/ClientAPI";
import type { Account } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { SET_ACCOUNT_QUERY_DATA } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";

export const ACCOUNTS_QUERY_KEY = () => ["ACCOUNTS"];

export const SET_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccounts>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetAccountsProps extends InfiniteQueryParams {}

export const GetAccounts = async ({
  pageSize,
  orderBy,
  search,
  locale,
}: GetAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/accounts`, {
    params: {
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetAccounts = (search?: string) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccounts>>>(
    ACCOUNTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetAccounts({ search, ...params }),
    {
      enabled: !!token,
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

export default useGetAccounts;
