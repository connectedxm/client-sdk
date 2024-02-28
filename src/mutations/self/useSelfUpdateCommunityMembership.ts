import { CommunityMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface SelfUpdateCommunityMembershipParams extends MutationParams {
  communityId: string;
  membership: Partial<CommunityMembership>;
}

export const SelfUpdateCommunityMembership = async ({
  communityId,
  membership,
  clientApiParams,
  queryClient,
  locale = "en",
}: SelfUpdateCommunityMembershipParams): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY(communityId), locale],
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

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<CommunityMembership>
  >(`/self/communities/${communityId}`, membership);

  return data;
};

export const useSelfUpdateCommunityMembership = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfUpdateCommunityMembership>>,
      Omit<
        SelfUpdateCommunityMembershipParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfUpdateCommunityMembershipParams,
    Awaited<ConnectedXMResponse<CommunityMembership>>
  >(SelfUpdateCommunityMembership, options);
};
