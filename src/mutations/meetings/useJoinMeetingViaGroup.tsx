import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import type { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MeetingJoinViaGroupInputs } from "@src/params";

/**
 * @category Params
 * @group Meetings
 */
export interface JoinMeetingViaGroupParams extends MutationParams {
  meetingId: string;
  groupId: string;
}

/**
 * @category Methods
 * @group Meetings
 */
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

/**
 * @category Mutations
 * @group Meetings
 */
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
