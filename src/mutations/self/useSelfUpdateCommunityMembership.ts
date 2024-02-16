import { ConnectedXM } from "@context/api/ConnectedXM";
import { CommunityMembership } from "@context/interfaces";
import { QUERY_KEY as COMMUNITY_MEMBERSHIP } from "@context/queries/self/useGetSelfCommunityMembership";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface SelfUpdateCommunityMembershipParams extends MutationParams {
  communityId: string;
  membership: CommunityMembership;
}

export const SelfUpdateCommunityMembership = async ({
  communityId,
  membership,
}: SelfUpdateCommunityMembershipParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/self/communities/${communityId}`,
    membership
  );
  return data;
};

export const useSelfUpdateCommunityMembership = (communityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    (params: Omit<SelfUpdateCommunityMembershipParams, "communityId">) =>
      SelfUpdateCommunityMembership({ communityId, ...params }),
    {
      onMutate: ({ membership }) => {
        queryClient.setQueryData(
          [COMMUNITY_MEMBERSHIP, communityId],
          (data: any) => {
            return {
              ...data,
              data: {
                ...data.data,
                ...membership,
              },
            };
          }
        );
      },
    }
  );
};

export default useSelfUpdateCommunityMembership;
