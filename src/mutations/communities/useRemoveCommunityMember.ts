import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_MEMBERS_QUERY_KEY } from "@src/queries";

export interface RemoveCommunityMememberParams extends MutationParams {
  communityId: string;
  accountId: string;
}

export const RemoveCommunityMemember = async ({
  communityId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveCommunityMememberParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/communities/${communityId}/members/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_MEMBERS_QUERY_KEY(communityId),
    });
  }

  return data;
};

export const useRemoveCommunityMemember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveCommunityMemember>>,
      Omit<RemoveCommunityMememberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveCommunityMememberParams,
    Awaited<ReturnType<typeof RemoveCommunityMemember>>
  >(RemoveCommunityMemember, options);
};
