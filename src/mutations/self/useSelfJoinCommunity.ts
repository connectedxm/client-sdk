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

export interface SelfJoinCommunityParams extends MutationParams {
  communityId: string;
}

export const SelfJoinCommunity = async ({
  communityId,
  clientApi,
  queryClient,
}: SelfJoinCommunityParams): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const { data } = await clientApi.post<
    ConnectedXMResponse<CommunityMembership>
  >(`/self/communities/${communityId}`);

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
  }

  return data;
};

export const useSelfJoinCommunity = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfJoinCommunity>>,
      Omit<SelfJoinCommunityParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfJoinCommunityParams,
    Awaited<ReturnType<typeof SelfJoinCommunity>>
  >(SelfJoinCommunity, params, options);
};
