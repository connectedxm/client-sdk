import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Community } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import {
  COMMUNITY_QUERY_KEY,
  SET_COMMUNITY_QUERY_DATA,
} from "../communities/useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";

export const ACCOUNT_COMMUNITIES_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "COMMUNITIES",
];

export const SET_ACCOUNT_COMMUNITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_COMMUNITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountCommunities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_COMMUNITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetAccountCommunitiesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountCommunities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  locale,
  queryClient,
}: GetAccountCommunitiesProps): Promise<ConnectedXMResponse<Community[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/accounts/${accountId}/communities`, {
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
      (communityId) => COMMUNITY_QUERY_KEY(communityId),
      SET_COMMUNITY_QUERY_DATA
    );
  }

  return data;
};

const useGetAccountCommunities = (
  accountId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetAccountCommunities>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetAccountCommunities>>(
    ACCOUNT_COMMUNITIES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountCommunities({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!accountId && (options?.enabled ?? true),
    }
  );
};

export default useGetAccountCommunities;
