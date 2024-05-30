import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_NOTIFICATIONS_QUERY_KEY,
  SELF_NOTIFICATION_COUNT_QUERY_KEY,
} from "@src/queries";

export interface AcceptGroupInviteParitation extends MutationParams {
  groupId: string;
  invitationId: string;
}

export const AcceptGroupInvitation = async ({
  groupId,
  invitationId,
  clientApiParams,
  queryClient,
}: AcceptGroupInviteParitation): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
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

export const useAcceptGroupInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AcceptGroupInvitation>>,
      Omit<AcceptGroupInviteParitation, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AcceptGroupInviteParitation,
    Awaited<ReturnType<typeof AcceptGroupInvitation>>
  >(AcceptGroupInvitation, options);
};
