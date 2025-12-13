import { Group, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import {
  ADD_SELF_RELATIONSHIP,
  GROUPS_QUERY_KEY,
  SET_GROUP_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { GroupCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Groups
 */
export interface CreateGroupParams extends MutationParams {
  group: GroupCreateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const CreateGroup = async ({
  group,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Group>>(`/groups`, {
    group,
    imageDataUri,
  });

  if (queryClient && data.status === "ok") {
    SET_GROUP_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: GROUPS_QUERY_KEY(),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "groups",
      data.data.id,
      "moderator"
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useCreateGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateGroup>>,
      Omit<CreateGroupParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupParams,
    Awaited<ReturnType<typeof CreateGroup>>
  >(CreateGroup, options);
};
