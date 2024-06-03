import { Group, GroupAccess, ConnectedXMResponse } from "@src/interfaces";
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

interface CreateGroup {
  name: string;
  description: string;
  access: keyof typeof GroupAccess;
  active: boolean;
  externalUrl?: string;
}

export interface CreateGroupParams extends MutationParams {
  group: CreateGroup;
  imageDataUri?: string;
}

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
