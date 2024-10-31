import { Group, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GROUPS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeactivateGroupParams extends MutationParams {
  groupId: string;
  group: Group;
  imageDataUri?: string;
}
export const DeactivateGroup = async ({
  groupId,
  group,
  imageDataUri,
  clientApiParams,
  queryClient,
}: DeactivateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  // I think this url and hook are wrong
  const { data } = await clientApi.post<ConnectedXMResponse<Group>>(
    `/groups/${groupId}`,
    {
      group,
      imageDataUri,
    }
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
