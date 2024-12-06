import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUPS_INVITED_QUERY_KEY,
  REMOVE_SELF_RELATIONSHIP,
  SELF_NOTIFICATIONS_QUERY_KEY,
} from "@src/queries";

export interface RejectGroupInvitationParams extends MutationParams {
  groupId: string;
}

export const RejectGroupInvitation = async ({
  groupId,
  clientApiParams,
  queryClient,
}: RejectGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/reject`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUPS_INVITED_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_NOTIFICATIONS_QUERY_KEY(""),
    });
    REMOVE_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "groups",
      groupId
    );
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
