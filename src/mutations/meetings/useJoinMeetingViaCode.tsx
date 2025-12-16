import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import type { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Meetings
 */
export interface JoinMeetingViaCodeParams extends MutationParams {
  meetingId: string;
  code: string;
}

/**
 * @category Methods
 * @group Meetings
 */
export const JoinMeetingViaCode = async ({
  meetingId,
  code,
  clientApiParams,
}: JoinMeetingViaCodeParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/meetings/${meetingId}/code/${code}`);
  return data;
};

/**
 * @category Mutations
 * @group Meetings
 */
export const useJoinMeetingViaCode = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinMeetingViaCode>>,
      Omit<JoinMeetingViaCodeParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    JoinMeetingViaCodeParams,
    Awaited<ReturnType<typeof JoinMeetingViaCode>>
  >(JoinMeetingViaCode, options);
};
