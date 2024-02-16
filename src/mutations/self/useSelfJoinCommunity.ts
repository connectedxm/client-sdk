import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { CommunityMembership } from "@context/interfaces";
import {
  QUERY_KEY as COMMUNITIES,
  QUERY_KEY as COMMUNITY,
} from "@context/queries/communities/useGetCommunity";
import { QUERY_KEY as COMMUNITY_MEMBERS } from "@context/queries/communities/useGetCommunityMembers";
import {
  QUERY_KEY as COMMUNITY_MEMBERSHIP,
  QUERY_KEY as SELF_COMMUNITY,
} from "@context/queries/self/useGetSelfCommunityMembership";
import { QUERY_KEY as SELF_COMMUNITIES } from "@context/queries/self/useGetSelfCommunityMemberships";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface SelfJoinCommunityParams extends MutationParams {
  communityId: string;
}

export const SelfJoinCommunity = async ({
  communityId,
}: SelfJoinCommunityParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/communities/${communityId}`);
  return data;
};

export const useSelfJoinCommunity = (communityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    (params: any) => SelfJoinCommunity({ communityId, ...params }),
    {
      onSuccess: (response: ConnectedXMResponse<CommunityMembership>) => {
        queryClient.setQueryData([COMMUNITY_MEMBERSHIP, communityId], response);
        queryClient.setQueryData([COMMUNITY, communityId], (response: any) => {
          if (!response.data) return response;
          return {
            ...response,
            data: {
              ...response.data,
              members: [{}],
            },
          };
        });
        queryClient.invalidateQueries([COMMUNITY_MEMBERS, communityId]);
        queryClient.invalidateQueries([COMMUNITIES]);
        queryClient.invalidateQueries([SELF_COMMUNITIES]);
        queryClient.invalidateQueries([SELF_COMMUNITY, communityId]);
      },
    },
  );
};

export default useSelfJoinCommunity;
