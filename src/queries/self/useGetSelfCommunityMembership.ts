import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import { CommunityMembership } from "@interfaces";
import { SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY } from "./useGetSelfCommunityMemberships";
import { QueryClient } from "@tanstack/react-query";

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
  locale,
}: GetSelfCommunityMembershipProps): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(
    `/self/communities/${communityId}/membership`
  );
  return data;
};

const useGetSelfCommunityMembership = (communityId: string) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<
    Awaited<ReturnType<typeof GetSelfCommunityMembership>>
  >(
    SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY(communityId),
    (params) => GetSelfCommunityMembership({ communityId, ...params }),
    {
      enabled: !!token,
    }
  );
};

export default useGetSelfCommunityMembership;
