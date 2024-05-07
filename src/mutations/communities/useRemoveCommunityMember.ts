import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_MEMBERS_QUERY_KEY } from "@src/queries";

export interface RemoveCommunityMemberParams extends MutationParams {
  communityId: string;
  accountId: string;
}

export const RemoveCommunityMember = async ({
  communityId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveCommunityMemberParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/communities/${communityId}/members/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_MEMBERS_QUERY_KEY(communityId),
    });
  }

  return data;
};

export const useRemoveCommunityMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveCommunityMember>>,
      Omit<RemoveCommunityMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveCommunityMemberParams,
    Awaited<ReturnType<typeof RemoveCommunityMember>>
  >(RemoveCommunityMember, options);
};
