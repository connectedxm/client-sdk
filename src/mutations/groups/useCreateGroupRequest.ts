import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP } from "@src/queries";

export interface CreateGroupRequestParams extends MutationParams {
  groupId: string;
}

export const CreateGroupRequest = async ({
  groupId,
  clientApiParams,
  queryClient,
}: CreateGroupRequestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/groups/${groupId}/requests`
  );

  if (queryClient && data.status === "ok") {
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "groups",
      groupId,
      "requested"
    );
  }

  return data;
};

export const useCreateGroupRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateGroupRequest>>,
      Omit<CreateGroupRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupRequestParams,
    Awaited<ReturnType<typeof CreateGroupRequest>>
  >(CreateGroupRequest, options);
};
