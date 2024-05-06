import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_REQUESTS_QUERY_KEY } from "@src/queries";

export interface ApproveCommunityRequestParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const ApproveCommunityRequest = async ({
  communityId,
  requestId,
  clientApiParams,
  queryClient,
}: ApproveCommunityRequestParams): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/requests/${requestId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_REQUESTS_QUERY_KEY(communityId),
    });
  }

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
