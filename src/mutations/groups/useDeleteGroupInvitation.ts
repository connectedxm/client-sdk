import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_REQUESTS_QUERY_KEY } from "@src/queries";

export interface DeleteGroupInvitationParams extends MutationParams {
  groupId: string;
  requestId: string;
}

export const DeleteGroupInvitation = async ({
  groupId,
  requestId,
  clientApiParams,
  queryClient,
}: DeleteGroupInvitationParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}/invites/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
  }

  return data;
};

export const useDeleteGroupInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteGroupInvitation>>,
      Omit<DeleteGroupInvitationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteGroupInvitationParams,
    Awaited<ReturnType<typeof DeleteGroupInvitation>>
  >(DeleteGroupInvitation, options);
};
