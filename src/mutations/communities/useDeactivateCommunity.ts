import {
  Community,
  CommunityMembership,
  ConnectedXMResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { COMMUNITIES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeactivateCommunityParams extends MutationParams {
  communityId: string;
  community: Community;
  imageDataUri?: string;
}

export const DeactivateCommunity = async ({
  communityId,
  community,
  imageDataUri,
  clientApiParams,
  queryClient,
}: DeactivateCommunityParams): Promise<
  ConnectedXMResponse<CommunityMembership>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<CommunityMembership>
  >(`/communities/${communityId}`, {
    community,
    imageDataUri,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITIES_QUERY_KEY(),
    });
  }

  return data;
};

export const useDeactivateCommunity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeactivateCommunity>>,
      Omit<DeactivateCommunityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeactivateCommunityParams,
    Awaited<ReturnType<typeof DeactivateCommunity>>
  >(DeactivateCommunity, options);
};
