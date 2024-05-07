import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_NOTIFICATIONS_QUERY_KEY,
  SELF_NOTIFICATION_COUNT_QUERY_KEY,
} from "@src/queries";

export interface AcceptCommunityInviteParitation extends MutationParams {
  communityId: string;
  requestId: string;
}

export const AcceptCommunityInvitation = async ({
  communityId,
  requestId,
  clientApiParams,
  queryClient,
}: AcceptCommunityInviteParitation): Promise<
  ConnectedXMResponse<Community>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/invites/${requestId}`
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

export const useAcceptCommunityInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AcceptCommunityInvitation>>,
      Omit<AcceptCommunityInviteParitation, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AcceptCommunityInviteParitation,
    Awaited<ReturnType<typeof AcceptCommunityInvitation>>
  >(AcceptCommunityInvitation, options);
};
