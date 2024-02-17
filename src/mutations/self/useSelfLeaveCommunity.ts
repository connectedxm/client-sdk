import { ConnectedXMResponse } from "@src/interfaces";
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

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export interface SelfLeaveCommunityParams extends MutationParams {
  communityId: string;
}

export const SelfLeaveCommunity = async ({
  communityId,
  clientApi,
  queryClient,
}: SelfLeaveCommunityParams): Promise<ConnectedXMResponse<null>> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/communities/${communityId}`
  );

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

export const useSelfLeaveCommunity = (
  options: MutationOptions<
    Awaited<ReturnType<typeof SelfLeaveCommunity>>,
    SelfLeaveCommunityParams
  >
) => {
  return useConnectedMutation<
    SelfLeaveCommunityParams,
    Awaited<ReturnType<typeof SelfLeaveCommunity>>
  >((params) => SelfLeaveCommunity({ ...params }), options);
};
