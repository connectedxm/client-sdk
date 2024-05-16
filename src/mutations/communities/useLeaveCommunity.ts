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
import { GetClientAPI } from "@src/ClientAPI";
import { REMOVE_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";

export interface LeaveCommunityParams extends MutationParams {
  communityId: string;
}

export const LeaveCommunity = async ({
  communityId,
  clientApiParams,
  queryClient,
}: LeaveCommunityParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/communities/${communityId}/leave`
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
    REMOVE_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "communities",
      communityId
    );
  }

  return data;
};

export const useLeaveCommunity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof LeaveCommunity>>,
      Omit<LeaveCommunityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    LeaveCommunityParams,
    Awaited<ReturnType<typeof LeaveCommunity>>
  >(LeaveCommunity, options);
};
