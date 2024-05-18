import { GroupRequest, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_NOTIFICATIONS_QUERY_KEY,
  SELF_NOTIFICATION_COUNT_QUERY_KEY,
  SET_GROUP_REQUEST_QUERY_DATA,
} from "@src/queries";

export interface RejectGroupInvitationParams extends MutationParams {
  groupId: string;
  requestId: string;
}

export const RejectGroupInvitation = async ({
  groupId,
  requestId,
  clientApiParams,
  queryClient,
}: RejectGroupInvitationParams): Promise<ConnectedXMResponse<GroupRequest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<GroupRequest>>(
    `/groups/${groupId}/invites/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    SET_GROUP_REQUEST_QUERY_DATA(queryClient, [groupId, data.data.id], data);

    queryClient.invalidateQueries({
      queryKey: SELF_NOTIFICATIONS_QUERY_KEY(""),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_NOTIFICATION_COUNT_QUERY_KEY(""),
    });
  }

  return data;
};

export const useRejectGroupInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RejectGroupInvitation>>,
      Omit<RejectGroupInvitationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RejectGroupInvitationParams,
    Awaited<ReturnType<typeof RejectGroupInvitation>>
  >(RejectGroupInvitation, options);
};
