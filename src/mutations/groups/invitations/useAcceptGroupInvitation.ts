import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  ADD_SELF_RELATIONSHIP,
  GROUPS_INVITED_QUERY_KEY,
  SELF_NOTIFICATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface AcceptGroupInvitationParams extends MutationParams {
  groupId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const AcceptGroupInvitation = async ({
  groupId,
  clientApiParams,
  queryClient,
}: AcceptGroupInvitationParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/groups/${groupId}/invitations/accept`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUPS_INVITED_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_NOTIFICATIONS_QUERY_KEY(""),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "groups",
      groupId,
      "member"
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useAcceptGroupInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AcceptGroupInvitation>>,
      Omit<AcceptGroupInvitationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AcceptGroupInvitationParams,
    Awaited<ReturnType<typeof AcceptGroupInvitation>>
  >(AcceptGroupInvitation, options);
};
