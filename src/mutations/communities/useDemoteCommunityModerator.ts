import { CommunityMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_MEMBERS_QUERY_KEY } from "@src/queries";

export interface DemoteCommunityModeratorParams extends MutationParams {
  communityId: string;
  accountId: string;
}

export const DemoteCommunityModerator = async ({
  communityId,
  accountId,
  clientApiParams,
  queryClient,
}: DemoteCommunityModeratorParams): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<CommunityMembership>
  >(`/communities/${communityId}/members/${accountId}/demote`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_MEMBERS_QUERY_KEY(communityId),
    });
  }

  return data;
};

export const useDemoteCommunityModerator = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DemoteCommunityModerator>>,
      Omit<DemoteCommunityModeratorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DemoteCommunityModeratorParams,
    Awaited<ReturnType<typeof DemoteCommunityModerator>>
  >(DemoteCommunityModerator, options);
};
