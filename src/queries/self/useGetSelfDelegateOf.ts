import { ClientAPI } from "@src/ClientAPI";
import { Account, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { SET_ACCOUNT_QUERY_DATA } from "../accounts/useGetAccount";
import { useConnectedXM } from "@src/hooks";

export const SELF_DELEGATE_OF_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "DELEGATE_OF",
];

interface GetSelfDelegateOfProps extends InfiniteQueryParams {}

export const GetSelfDelegateOf = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetSelfDelegateOfProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
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
      (accountId) => [accountId],
      SET_ACCOUNT_QUERY_DATA
    );
  }

  return data;
};

const useGetSelfDelegateOf = (
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetSelfDelegateOf>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetSelfDelegateOf>>(
    SELF_DELEGATE_OF_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfDelegateOf({ ...params }),
    params,
    {
      ...options,
      enabled: !!token,
    }
  );
};

export default useGetSelfDelegateOf;
