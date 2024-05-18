import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface CreateGroupRequestParams extends MutationParams {
  groupId: string;
}

export const CreateGroupRequest = async ({
  groupId,
  clientApiParams,
}: CreateGroupRequestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/groups/${groupId}/requests`
  );

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
