import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_INVITABLE_ACCOUNTS_QUERY_KEY } from "@src/queries";

export interface CreateCommunityInvitationsParams extends MutationParams {
  communityId: string;
  accountIds: string[];
}

export const CreateCommunityInvitations = async ({
  communityId,
  accountIds,
  clientApiParams,
  queryClient,
}: CreateCommunityInvitationsParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/communities/${communityId}/invites`,
    {
      accountIds,
    }
  );

  if (queryClient && data.message === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_INVITABLE_ACCOUNTS_QUERY_KEY(communityId),
    });
  }

  return data;
};

export const useCreateCommunityInvitations = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateCommunityInvitations>>,
      Omit<CreateCommunityInvitationsParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCommunityInvitationsParams,
    Awaited<ReturnType<typeof CreateCommunityInvitations>>
  >(CreateCommunityInvitations, options);
};
