import { Group, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GROUPS_QUERY_KEY, SET_GROUP_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { GroupUpdateInputs } from "@src/params";

export interface UpdateGroupParams extends MutationParams {
  groupId: string;
  group: GroupUpdateInputs;
  imageDataUri?: string;
}

export const UpdateGroup = async ({
  groupId,
  group,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Group>>(
    `/groups/${groupId}`,
    {
      group,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_GROUP_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: GROUPS_QUERY_KEY(),
    });
  }

  return data;
};

export const useUpdateGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateGroup>>,
      Omit<UpdateGroupParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateGroupParams,
    Awaited<ReturnType<typeof UpdateGroup>>
  >(UpdateGroup, options);
};
