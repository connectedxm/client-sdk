import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CommunityRequest, CommunityRequestStatus } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_REQUEST_QUERY_KEY } from "./useGetCommunityRequest";

export const COMMUNITY_REQUESTS_QUERY_KEY = (
  communityId: string,
  status?: keyof typeof CommunityRequestStatus
): QueryKey => {
  const keys = [...COMMUNITY_QUERY_KEY(communityId), "REQUESTS"];

  if (status) {
    keys.push(status);
  }

  return keys;
};

export const SET_COMMUNITY_REQUESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_REQUESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityRequests>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_REQUESTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetCommunityRequestsProps extends InfiniteQueryParams {
  communityId: string;
  status?: keyof typeof CommunityRequestStatus;
}

export const GetCommunityRequests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  communityId,
  queryClient,
  clientApiParams,
  locale,
}: GetCommunityRequestsProps): Promise<
  ConnectedXMResponse<CommunityRequest[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/communities/${communityId}/requests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (communityId) => COMMUNITY_REQUEST_QUERY_KEY(communityId, data.data.id),
      locale
    );
  }

  return data;
};

export const useGetCommunityRequests = (
  communityId: string = "",
  status?: keyof typeof CommunityRequestStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityRequests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityRequests>>
  >(
    COMMUNITY_REQUESTS_QUERY_KEY(communityId, status),
    (params: InfiniteQueryParams) =>
      GetCommunityRequests({ communityId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
