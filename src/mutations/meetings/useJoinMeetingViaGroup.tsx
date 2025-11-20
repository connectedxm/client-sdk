import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import type { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface JoinMeetingViaGroupParams extends MutationParams {
  meetingId: string;
  groupId: string;
}

export const JoinMeetingViaGroup = async ({
  meetingId,
  groupId,
  clientApiParams,
}: JoinMeetingViaGroupParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/meetings/${meetingId}/group/${groupId}`
  );
  return data;
};

export const useJoinMeetingViaGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinMeetingViaGroup>>,
      Omit<JoinMeetingViaGroupParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    JoinMeetingViaGroupParams,
    Awaited<ReturnType<typeof JoinMeetingViaGroup>>
  >(JoinMeetingViaGroup, options);
};
