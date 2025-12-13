import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUPS_REQUESTED_QUERY_KEY,
  REMOVE_SELF_RELATIONSHIP,
} from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface CancelGroupRequestParams extends MutationParams {
  groupId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const CancelGroupRequest = async ({
  groupId,
  clientApiParams,
  queryClient,
}: CancelGroupRequestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/groups/${groupId}/requests/cancel`
  );

  if (queryClient && data.status === "ok") {
    REMOVE_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "groups",
      groupId
    );
    queryClient.invalidateQueries({
      queryKey: GROUPS_REQUESTED_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useCancelGroupRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelGroupRequest>>,
      Omit<CancelGroupRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelGroupRequestParams,
    Awaited<ReturnType<typeof CancelGroupRequest>>
  >(CancelGroupRequest, options);
};
