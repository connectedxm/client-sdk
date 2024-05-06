import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface CreateCommunityInvitationsParams extends MutationParams {
  communityId: string;
  accountIds: string[];
}

export const CreateCommunityInvitations = async ({
  communityId,
  accountIds,
  clientApiParams,
}: CreateCommunityInvitationsParams): Promise<
  ConnectedXMResponse<Community>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/invites`,
    {
      accountIds,
    }
  );

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
