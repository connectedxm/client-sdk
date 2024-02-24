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

export interface SelfLeaveCommunityParams extends MutationParams {
  communityId: string;
}

export const SelfLeaveCommunity = async ({
  communityId,
  clientApiParams,
  queryClient,
}: SelfLeaveCommunityParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfLeaveCommunity>>,
      Omit<SelfLeaveCommunityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfLeaveCommunityParams,
    Awaited<ReturnType<typeof SelfLeaveCommunity>>
  >(SelfLeaveCommunity, params, options);
};
