import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_REQUESTS_QUERY_KEY } from "@src/queries";

export interface AcceptCommunityRequestParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const AcceptCommunityRequest = async ({
  communityId,
  requestId,
  clientApiParams,
  queryClient,
}: AcceptCommunityRequestParams): Promise<ConnectedXMResponse<Community>> => {
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

export const useAcceptCommunityRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AcceptCommunityRequest>>,
      Omit<AcceptCommunityRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AcceptCommunityRequestParams,
    Awaited<ReturnType<typeof AcceptCommunityRequest>>
  >(AcceptCommunityRequest, options);
};
