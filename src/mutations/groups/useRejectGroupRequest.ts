import { GroupRequest, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUP_REQUESTS_QUERY_KEY,
  SET_GROUP_REQUEST_QUERY_DATA,
} from "@src/queries";

export interface RejectGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

export const RejectGroupRequest = async ({
  groupId,
  requestId,
  clientApiParams,
  queryClient,
}: RejectGroupRequestParams): Promise<ConnectedXMResponse<GroupRequest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<GroupRequest>>(
    `/groups/${groupId}/requests/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    SET_GROUP_REQUEST_QUERY_DATA(queryClient, [groupId, data.data.id], data);

    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
  }

  return data;
};

export const useRejectGroupRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RejectGroupRequest>>,
      Omit<RejectGroupRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RejectGroupRequestParams,
    Awaited<ReturnType<typeof RejectGroupRequest>>
  >(RejectGroupRequest, options);
};
