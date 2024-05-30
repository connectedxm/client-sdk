import { Group, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUP_INVITABLE_ACCOUNTS_QUERY_KEY,
  GROUP_REQUESTS_QUERY_KEY,
} from "@src/queries";

export interface AcceptGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

export const AcceptGroupRequest = async ({
  groupId,
  requestId,
  clientApiParams,
  queryClient,
}: AcceptGroupRequestParams): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Group>>(
    `/groups/${groupId}/requests/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITABLE_ACCOUNTS_QUERY_KEY(groupId),
    });
  }

  return data;
};

export const useAcceptGroupRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AcceptGroupRequest>>,
      Omit<AcceptGroupRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AcceptGroupRequestParams,
    Awaited<ReturnType<typeof AcceptGroupRequest>>
  >(AcceptGroupRequest, options);
};
