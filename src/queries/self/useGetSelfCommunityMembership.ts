import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { CommunityMembership, ConnectedXMResponse } from "@interfaces";
import { SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY } from "./useGetSelfCommunityMemberships";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks";

export const SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY = (communityId: string) => [
  ...SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(),
  communityId,
];

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

interface GetSelfCommunityMembershipProps extends SingleQueryParams {
  communityId: string;
}

export const GetSelfCommunityMembership = async ({
  communityId,
  clientApi,
}: GetSelfCommunityMembershipProps): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const { data } = await clientApi.get(
    `/self/communities/${communityId}/membership`
  );
  return data;
};

const useGetSelfCommunityMembership = (
  communityId: string,
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfCommunityMembership>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfCommunityMembership>>(
    SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY(communityId),
    (params: SingleQueryParams) =>
      GetSelfCommunityMembership({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!communityId && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfCommunityMembership;
