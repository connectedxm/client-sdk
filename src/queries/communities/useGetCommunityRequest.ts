import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Community } from "@interfaces";
import { COMMUNITIES_QUERY_KEY } from "./useGetCommunities";
import { QueryClient, SetDataOptions, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const COMMUNITY_REQUEST_QUERY_KEY = (communityId: string): QueryKey => [
  ...COMMUNITIES_QUERY_KEY(),
  communityId,
];

export const SET_COMMUNITY_REQUEST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_REQUEST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityRequest>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...COMMUNITY_REQUEST_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetCommunityRequestProps extends SingleQueryParams {
  communityId: string;
  requestId: string;
}

export const GetCommunityRequest = async ({
  communityId,
  requestId,
  clientApiParams,
}: GetCommunityRequestProps): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/communities/${communityId}/requests/${requestId}`
  );
  return data;
};

export const useGetCommunityRequest = (
  communityId: string = "",
  requestId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetCommunityRequest>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCommunityRequest>>(
    COMMUNITY_REQUEST_QUERY_KEY(communityId),
    (params) => GetCommunityRequest({ communityId, requestId, ...params }),
    {
      ...options,
      enabled: !!communityId && !!requestId && (options?.enabled ?? true),
    }
  );
};
