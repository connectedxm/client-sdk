import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import type { Community } from "@interfaces";
import { COMMUNITIES_QUERY_KEY } from "./useGetCommunities";
import { QueryClient, SetDataOptions } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITY_QUERY_KEY = (communityId: string) => [
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

interface GetCommunityProps extends SingleQueryParams {
  communityId: string;
}

export const GetCommunity = async ({
  communityId,
  locale,
}: GetCommunityProps): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/communities/${communityId}`);
  return data;
};

const useGetCommunity = (
  communityId: string,
  params: SingleQueryParams = {},
  options: SingleQueryOptions<ReturnType<typeof GetCommunity>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCommunity>>(
    COMMUNITY_QUERY_KEY(communityId),
    (params) => GetCommunity({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};

export default useGetCommunity;
