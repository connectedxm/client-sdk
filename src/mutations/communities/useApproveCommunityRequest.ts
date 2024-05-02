import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface ApproveCommunityRequestParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const ApproveCommunityRequest = async ({
  communityId,
  requestId,
  clientApiParams,
}: ApproveCommunityRequestParams): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/requests/${requestId}`
  );

  return data;
};

export const useApproveCommunityRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ApproveCommunityRequest>>,
      Omit<ApproveCommunityRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ApproveCommunityRequestParams,
    Awaited<ReturnType<typeof ApproveCommunityRequest>>
  >(ApproveCommunityRequest, options);
};
