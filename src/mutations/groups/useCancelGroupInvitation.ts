import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUP_INVITATIONS_QUERY_KEY,
  GROUP_REQUESTS_QUERY_KEY,
} from "@src/queries";

export interface CancelGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

export const CancelGroupInvitation = async ({
  groupId,
  invitationId,
  clientApiParams,
  queryClient,
}: CancelGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/${invitationId}/cancel`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITATIONS_QUERY_KEY(groupId),
    });
  }

  return data;
};

export const useCancelGroupInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelGroupInvitation>>,
      Omit<CancelGroupInvitationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelGroupInvitationParams,
    Awaited<ReturnType<typeof CancelGroupInvitation>>
  >(CancelGroupInvitation, options);
};
