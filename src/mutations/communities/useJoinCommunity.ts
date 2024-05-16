import { CommunityMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import {
  COMMUNITIES_QUERY_KEY,
  COMMUNITY_QUERY_KEY,
  SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY,
  SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";

export interface JoinCommunityParams extends MutationParams {
  communityId: string;
}

export const JoinCommunity = async ({
  communityId,
  clientApiParams,
  queryClient,
}: JoinCommunityParams): Promise<ConnectedXMResponse<CommunityMembership>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<CommunityMembership>
  >(`/communities/${communityId}/join`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_QUERY_KEY(communityId),
    });
    queryClient.invalidateQueries({
      queryKey: COMMUNITIES_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY(communityId),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "communities",
      communityId,
      "member"
    );
  }

  return data;
};

export const useJoinCommunity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinCommunity>>,
      Omit<JoinCommunityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    JoinCommunityParams,
    Awaited<ReturnType<typeof JoinCommunity>>
  >(JoinCommunity, options);
};
