import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { CommunityMembership, ConnectedXMResponse } from "@interfaces";
import { SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY } from "./useGetSelfCommunityMemberships";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY = (
  communityId: string
): QueryKey => [...SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(), communityId];

export const SET_SELF_COMMUNITY_MEMBERSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfCommunityMembership>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfCommunityMembershipProps extends SingleQueryParams {
  communityId: string;
}

export const GetSelfCommunityMembership = async ({
  communityId,
  clientApiParams,
}: GetSelfCommunityMembershipProps): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/communities/${communityId}/membership`
  );
  return data;
};

export const useGetSelfCommunityMembership = (
  communityId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfCommunityMembership>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfCommunityMembership>>(
    SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY(communityId),
    (params: SingleQueryParams) =>
      GetSelfCommunityMembership({ communityId, ...params }),
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
