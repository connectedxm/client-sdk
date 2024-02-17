import {
  COMMUNITIES_QUERY_KEY,
  SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY,
  SET_COMMUNITY_QUERY_DATA,
} from "@src/queries";
import {
  MutationParams,
  useConnectedMutation,
  MutationOptions,
} from "../useConnectedMutation";
import { Community, ConnectedXMResponse } from "@src/interfaces";

export interface UpdateCommunityParams extends MutationParams {
  communityId: string;
  description?: string;
  externalUrl?: string;
  base64?: string;
}

export const UpdateCommunity = async ({
  communityId,
  description,
  externalUrl,
  base64,
  clientApi,
  queryClient,
}: UpdateCommunityParams): Promise<ConnectedXMResponse<Community>> => {
  const { data } = await clientApi.put<ConnectedXMResponse<Community>>(
    `/communityModerator/${communityId}`,
    {
      description: description || undefined,
      externalUrl: externalUrl || undefined,
      buffer: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_COMMUNITY_QUERY_DATA(queryClient, [data.data.slug], data);
    queryClient.invalidateQueries({
      queryKey: SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({ queryKey: COMMUNITIES_QUERY_KEY() });
  }

  return data;
};

export const useUpdateCommunity = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateCommunity>>,
    UpdateCommunityParams
  >
) => {
  return useConnectedMutation<
    UpdateCommunityParams,
    Awaited<ReturnType<typeof UpdateCommunity>>
  >(UpdateCommunity, params, options);
};

export default useUpdateCommunity;
