import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface RejectCommunityRequestParams extends MutationParams {
  communityId: string;
  requestId: string;
}

export const RejectCommunityRequest = async ({
  communityId,
  requestId,
  clientApiParams,
}: RejectCommunityRequestParams): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/requests/${requestId}`
  );

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
