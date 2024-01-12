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
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { SET_SPONSOR_QUERY_DATA } from "../sponsors/useGetSponsor";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITY_SPONSORS_QUERY_KEY = (communityId: string) => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "SPONSORS",
];

export const SET_COMMUNITY_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunitySponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetCommunitySponsorsProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunitySponsors = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  locale,
}: GetCommunitySponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/communities/${communityId}/sponsors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetCommunitySponsors = (communityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunitySponsors>>
  >(
    COMMUNITY_SPONSORS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunitySponsors({ communityId, ...params }),
    {
      enabled: !!communityId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (eventId) => [eventId],
          SET_SPONSOR_QUERY_DATA
        ),
    }
  );
};

export default useGetCommunitySponsors;
