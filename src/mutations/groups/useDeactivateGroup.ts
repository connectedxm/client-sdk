import { Group, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GROUPS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeactivateGroupParams extends MutationParams {
  groupId: string;
}
export const DeactivateGroup = async ({
  groupId,
  clientApiParams,
  queryClient,
}: DeactivateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  // I think this url and hook are wrong. there is no POST for this endpoint
  const { data } = await clientApi.delete<ConnectedXMResponse<Group>>(
    `/groups/${groupId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUPS_QUERY_KEY(),
    });
  }

  return data;
};

export const useDeactivateGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeactivateGroup>>,
      Omit<DeactivateGroupParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeactivateGroupParams,
    Awaited<ReturnType<typeof DeactivateGroup>>
  >(DeactivateGroup, options);
};
