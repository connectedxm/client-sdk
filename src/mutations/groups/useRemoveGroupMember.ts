import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_MEMBERS_QUERY_KEY } from "@src/queries";

export interface RemoveGroupMemberParams extends MutationParams {
  groupId: string;
  accountId: string;
}

export const RemoveGroupMember = async ({
  groupId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveGroupMemberParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}/members/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_MEMBERS_QUERY_KEY(groupId),
    });
  }

  return data;
};

export const useRemoveGroupMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveGroupMember>>,
      Omit<RemoveGroupMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveGroupMemberParams,
    Awaited<ReturnType<typeof RemoveGroupMember>>
  >(RemoveGroupMember, options);
};
