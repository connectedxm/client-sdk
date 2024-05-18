import { Group, ConnectedXMResponse } from "@src/interfaces";
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
  requestId: string;
}

export const AcceptGroupInvitation = async ({
  groupId,
  requestId,
  clientApiParams,
  queryClient,
}: AcceptGroupInviteParitation): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Group>>(
    `/groups/${groupId}/invites/${requestId}`
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
