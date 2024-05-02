import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { COMMUNITIES_QUERY_KEY, SET_COMMUNITY_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateCommunityParams extends MutationParams {
  communityId: string;
  community: {
    name?: string;
    description?: string;
    externalUrl?: string;
    access?: "public" | "private";
  };
  imageDataUri?: string;
}

export const UpdateCommunity = async ({
  communityId,
  community,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateCommunityParams): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities/${communityId}`,
    {
      community,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_COMMUNITY_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: COMMUNITIES_QUERY_KEY(),
    });
  }

  return data;
};

export const useUpdateCommunity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateCommunity>>,
      Omit<UpdateCommunityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateCommunityParams,
    Awaited<ReturnType<typeof UpdateCommunity>>
  >(UpdateCommunity, options);
};
