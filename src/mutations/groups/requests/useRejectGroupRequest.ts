import { GroupRequest, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUP_REQUESTS_QUERY_KEY,
  REMOVE_SELF_RELATIONSHIP,
  SET_GROUP_REQUEST_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface RejectGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const RejectGroupRequest = async ({
  groupId,
  requestId,
  clientApiParams,
  queryClient,
}: RejectGroupRequestParams): Promise<ConnectedXMResponse<GroupRequest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<GroupRequest>>(
    `/groups/${groupId}/requests/${requestId}/reject`
  );

  if (queryClient && data.status === "ok") {
    SET_GROUP_REQUEST_QUERY_DATA(queryClient, [groupId, data.data.id], data);

    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
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

/**
 * @category Mutations
 * @group Groups
 */
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
