import { CommunityMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import {
  COMMUNITY_MEMBERS_QUERY_KEY,
  COMMUNITY_QUERY_KEY,
  SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY,
  SELF_COMMUNITY_MEMBERSHIP_QUERY_KEY,
  SET_SELF_COMMUNITY_MEMBERSHIP_QUERY_DATA,
} from "@src/queries";

export interface SelfJoinCommunityParams extends MutationParams {
  communityId: string;
}

export const SelfJoinCommunity = async ({
  communityId,
  clientApi,
  queryClient,
  locale = "en",
}: SelfJoinCommunityParams): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const { data } = await clientApi.post<
    ConnectedXMResponse<CommunityMembership>
  >(`/self/communities/${communityId}`);

  if (queryClient && data.status === "ok") {
    SET_SELF_COMMUNITY_MEMBERSHIP_QUERY_DATA(queryClient, [communityId], data, [
      locale,
    ]);
    queryClient.setQueryData(
      [...COMMUNITY_QUERY_KEY(communityId), locale],
      (response: any) => {
        if (!response.data) return response;
        return {
          ...response,
          data: {
            ...response.data,
            members: [{}],
          },
        };
      }
    );
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_MEMBERS_QUERY_KEY(communityId),
    });
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_QUERY_KEY(communityId),
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
