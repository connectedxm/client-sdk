import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Purchase } from "@context/interfaces";
import {
  QUERY_KEY as COMMUNITIES,
  QUERY_KEY as COMMUNITY,
} from "@context/queries/communities/useGetCommunity";
import { QUERY_KEY as SELF_COMMUNITY } from "@context/queries/self/useGetSelfCommunityMembership";
import { QUERY_KEY as SELF_COMMUNITIES } from "@context/queries/self/useGetSelfCommunityMemberships";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface SelfLeaveCommunityParams extends MutationParams {
  communityId: string;
}

export const SelfLeaveCommunity = async ({
  communityId,
}: SelfLeaveCommunityParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/self/communities/${communityId}`);
  return data;
};

export const useSelfLeaveCommunity = (communityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(() => SelfLeaveCommunity({ communityId }), {
    onSuccess: (_response: ConnectedXMResponse<Purchase>) => {
      queryClient.invalidateQueries([COMMUNITY, communityId]);
      queryClient.invalidateQueries([COMMUNITIES]);
      queryClient.invalidateQueries([SELF_COMMUNITIES]);
      queryClient.invalidateQueries([SELF_COMMUNITY, communityId]);
    },
  });
};

export default useSelfLeaveCommunity;
