import {
  Community,
  CommunityRequest,
  ConnectedXMResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  COMMUNITY_REQUESTS_QUERY_KEY,
  SET_COMMUNITY_REQUEST_QUERY_DATA,
} from "@src/queries";

export interface RejectCommunityRequestParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const RejectCommunityRequest = async ({
  communityId,
  requestId,
  clientApiParams,
  queryClient,
}: RejectCommunityRequestParams): Promise<
  ConnectedXMResponse<CommunityRequest>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<
    ConnectedXMResponse<CommunityRequest>
  >(`/communities/${communityId}/requests/${requestId}`);

  if (queryClient && data.status === "ok") {
    SET_COMMUNITY_REQUEST_QUERY_DATA(
      queryClient,
      [communityId, data.data.id],
      data
    );

    queryClient.invalidateQueries({
      queryKey: COMMUNITY_REQUESTS_QUERY_KEY(communityId),
    });
  }

  return data;
};

export const useRejectCommunityRequest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RejectCommunityRequest>>,
      Omit<RejectCommunityRequestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RejectCommunityRequestParams,
    Awaited<ReturnType<typeof RejectCommunityRequest>>
  >(RejectCommunityRequest, options);
};
