import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Community } from "@interfaces";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SET_COMMUNITY_QUERY_DATA } from "../communities/useGetCommunity";
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
  return data;
};

const useGetAccountCommunities = (accountId: string) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountCommunities>>
  >(
    ACCOUNT_COMMUNITIES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountCommunities({ accountId, ...params }),
    {
      enabled: !!token && !!accountId,
      onSuccess: (data) => {
        CacheIndividualQueries(
          data,
          queryClient,
          (communityId) => [communityId],
          SET_COMMUNITY_QUERY_DATA
        );
      },
    }
  );
};

export default useGetAccountCommunities;
