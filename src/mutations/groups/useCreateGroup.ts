import { Group, GroupAccess, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import {
  ADD_SELF_RELATIONSHIP,
  GROUP_QUERY_KEY,
  GROUPS_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";
interface CreateGroupInput {
  name: string;
  description: string;
  access: keyof typeof GroupAccess;
  active: boolean;
  externalUrl?: string;
}

export interface CreateGroupParams extends MutationParams {
  group: CreateGroupInput;
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
    queryClient.invalidateQueries({
      queryKey: GROUPS_QUERY_KEY(),
    });

    SetSingleQueryData(
      queryClient,
      GROUP_QUERY_KEY(data.data.id),
      clientApiParams.locale,
      data
    );

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
