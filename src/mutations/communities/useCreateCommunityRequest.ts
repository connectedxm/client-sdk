import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface CreateCommunityRequestParams extends MutationParams {
  communityId: string;
}

export const CreateCommunityRequest = async ({
  communityId,
  clientApiParams,
}: CreateCommunityRequestParams): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/requests`
  );

  return data;
};

export const useCreateCommunityRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateCommunityRequest>>,
      Omit<CreateCommunityRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCommunityRequestParams,
    Awaited<ReturnType<typeof CreateCommunityRequest>>
  >(CreateCommunityRequest, options);
};
