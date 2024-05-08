import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_REQUESTS_QUERY_KEY } from "@src/queries";

export interface DeleteCommunityInvitationParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const DeleteCommunityInvitation = async ({
  communityId,
  requestId,
  clientApiParams,
  queryClient,
}: DeleteCommunityInvitationParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/communities/${communityId}/invites/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_REQUESTS_QUERY_KEY(communityId),
    });
  }

  return data;
};

export const useDeleteCommunityInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteCommunityInvitation>>,
      Omit<DeleteCommunityInvitationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteCommunityInvitationParams,
    Awaited<ReturnType<typeof DeleteCommunityInvitation>>
  >(DeleteCommunityInvitation, options);
};
