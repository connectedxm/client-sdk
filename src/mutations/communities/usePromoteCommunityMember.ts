import { CommunityMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_MEMBERS_QUERY_KEY } from "@src/queries";

export interface PromoteCommunityMemberParams extends MutationParams {
  communityId: string;
  accountId: string;
}

export const PromoteCommunityMember = async ({
  communityId,
  accountId,
  clientApiParams,
  queryClient,
}: PromoteCommunityMemberParams): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<CommunityMembership>
  >(`/communities/${communityId}/members/${accountId}/promote`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_MEMBERS_QUERY_KEY(communityId),
    });
  }

  return data;
};

export const usePromoteCommunityMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof PromoteCommunityMember>>,
      Omit<PromoteCommunityMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    PromoteCommunityMemberParams,
    Awaited<ReturnType<typeof PromoteCommunityMember>>
  >(PromoteCommunityMember, options);
};
