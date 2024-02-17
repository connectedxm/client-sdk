import { CommunityMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY } from "@src/queries";

export interface SelfUpdateCommunityMembershipParams extends MutationParams {
  communityId: string;
  membership: CommunityMembership;
}

export const SelfUpdateCommunityMembership = async ({
  communityId,
  membership,
  clientApi,
  queryClient,
}: SelfUpdateCommunityMembershipParams): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY(communityId),
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
  }

  const { data } = await clientApi.put<
    ConnectedXMResponse<CommunityMembership>
  >(`/self/communities/${communityId}`, membership);

  return data;
};

export const useSelfUpdateCommunityMembership = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof SelfUpdateCommunityMembership>>,
    SelfUpdateCommunityMembershipParams
  >
) => {
  return useConnectedMutation<
    SelfUpdateCommunityMembershipParams,
    Awaited<ConnectedXMResponse<CommunityMembership>>
  >(SelfUpdateCommunityMembership, params, options);
};
