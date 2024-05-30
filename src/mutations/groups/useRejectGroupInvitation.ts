import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_NOTIFICATIONS_QUERY_KEY,
  SELF_NOTIFICATION_COUNT_QUERY_KEY,
} from "@src/queries";

export interface RejectGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

export const RejectGroupInvitation = async ({
  groupId,
  invitationId,
  clientApiParams,
  queryClient,
}: RejectGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/${invitationId}`
  );

  if (queryClient && data.status === "ok") {
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
