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

export const COMMUNITY_QUERY_KEY = (communityId: string): QueryKey => [
  ...COMMUNITIES_QUERY_KEY(),
  communityId,
];

export const SET_COMMUNITY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunity>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...COMMUNITY_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetCommunityProps extends SingleQueryParams {
  communityId: string;
}

export const GetCommunity = async ({
  communityId,
  clientApi,
}: GetCommunityProps): Promise<ConnectedXMResponse<Community>> => {
  const { data } = await clientApi.get(`/communities/${communityId}`);
  return data;
};

export const useGetCommunity = (
  communityId: string,
  options: SingleQueryOptions<ReturnType<typeof GetCommunity>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCommunity>>(
    COMMUNITY_QUERY_KEY(communityId),
    (params) => GetCommunity({ communityId, ...params }),
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
