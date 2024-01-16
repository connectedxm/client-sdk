import { ClientAPI } from "@src/ClientAPI";
import { Account, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SET_ACCOUNT_QUERY_DATA } from "../accounts/useGetAccount";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { useConnectedXM } from "@src/hooks";

export const SELF_DELEGATES_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "DELEGATES",
];

interface GetSelfDelegatesProps extends InfiniteQueryParams {}

export const GetSelfDelegates = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetSelfDelegatesProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/delegates`, {
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

const useGetSelfDelegates = (
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetSelfDelegates>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetSelfDelegates>>(
    SELF_DELEGATES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfDelegates(params),
    params,
    {
      ...options,
      enabled: !!token,
    }
  );
};

export default useGetSelfDelegates;
