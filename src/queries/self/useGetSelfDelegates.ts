import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import { Account } from "@interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useQueryClient } from "@tanstack/react-query";
import { SET_ACCOUNT_QUERY_DATA } from "../accounts/useGetAccount";
import { SELF_QUERY_KEY } from "./useGetSelf";

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
  return data;
};

const useGetSelfDelegates = () => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfDelegates>>
  >(SELF_DELEGATES_QUERY_KEY(), (params: any) => GetSelfDelegates(params), {
    enabled: !!token,
    onSuccess: (data) =>
      CacheIndividualQueries(
        data,
        queryClient,
        (accountId) => [accountId],
        SET_ACCOUNT_QUERY_DATA
      ),
  });
};

export default useGetSelfDelegates;
