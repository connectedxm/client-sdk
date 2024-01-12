import { ClientAPI } from "@src/ClientAPI";
import type { Community } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { SET_COMMUNITY_QUERY_DATA } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITIES_QUERY_KEY = () => ["COMMUNITIES"];

export const SET_COMMUNITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetCommunitiesProps extends InfiniteQueryParams {
  privateCommunities?: boolean;
}

export const GetCommunities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  privateCommunities,
  locale,
}: GetCommunitiesProps): Promise<ConnectedXMResponse<Community[]>> => {
  if (privateCommunities) {
    return {
      status: "ok",
      message: "Communities retreived",
      data: [],
    };
  }

  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/communities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      privateCommunities: privateCommunities || undefined,
    },
  });
  return data;
};

const useGetCommunities = () => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetCommunities>>>(
    COMMUNITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetCommunities({ ...params }),
    {
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (communityId) => [communityId],
          SET_COMMUNITY_QUERY_DATA
        ),
    }
  );
};

export default useGetCommunities;
