import { GroupRequest, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUP_REQUEST_QUERY_KEY,
  GROUP_REQUESTS_QUERY_KEY,
  REMOVE_SELF_RELATIONSHIP,
} from "@src/queries";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

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
    `/groups/${groupId}/requests/${requestId}/reject`
  );

  if (queryClient && data.status === "ok") {
    SetSingleQueryData(
      queryClient,
      GROUP_REQUEST_QUERY_KEY(groupId, data.data.id),
      clientApiParams.locale,
      data
    );

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
