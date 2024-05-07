import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  COMMUNITY_REQUESTS_QUERY_KEY,
  SET_COMMUNITY_REQUEST_QUERY_DATA,
} from "@src/queries";

export interface DeleteCommunityInvitationParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const DeleteCommunityInvitation = async ({
  communityId,
  requestId,
  clientApiParams,
  queryClient,
}: DeleteCommunityInvitationParams): Promise<
  ConnectedXMResponse<Community>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/invites/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    SET_COMMUNITY_REQUEST_QUERY_DATA(
      queryClient,
      [communityId, data.data.id],
      data
    );

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
