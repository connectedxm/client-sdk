import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_NOTIFICATIONS_QUERY_KEY,
  SELF_NOTIFICATION_COUNT_QUERY_KEY,
  SET_COMMUNITY_REQUEST_QUERY_DATA,
} from "@src/queries";

export interface RejectCommunityInvitationParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const RejectCommunityInvitation = async ({
  communityId,
  requestId,
  clientApiParams,
  queryClient,
}: RejectCommunityInvitationParams): Promise<
  ConnectedXMResponse<Community>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/invites/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    SET_COMMUNITY_REQUEST_QUERY_DATA(
      queryClient,
      [communityId, data.data.id],
      data
    );

    queryClient.invalidateQueries({
      queryKey: SELF_NOTIFICATIONS_QUERY_KEY(""),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_NOTIFICATION_COUNT_QUERY_KEY(""),
    });
  }

  return data;
};

export const useRejectCommunityInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RejectCommunityInvitation>>,
      Omit<RejectCommunityInvitationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RejectCommunityInvitationParams,
    Awaited<ReturnType<typeof RejectCommunityInvitation>>
  >(RejectCommunityInvitation, options);
};
