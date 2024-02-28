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
import { GetClientAPI } from "@src/ClientAPI";

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
  clientApiParams,
  queryClient,
  locale = "en",
}: UpdateCommunityParams): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Community>>(
    `/communityModerator/${communityId}`,
    {
      description: description || undefined,
      externalUrl: externalUrl || undefined,
      buffer: base64 ? base64 : undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_COMMUNITY_QUERY_DATA(queryClient, [data.data.slug], data, [locale]);
    queryClient.invalidateQueries({
      queryKey: SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({ queryKey: COMMUNITIES_QUERY_KEY() });
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
