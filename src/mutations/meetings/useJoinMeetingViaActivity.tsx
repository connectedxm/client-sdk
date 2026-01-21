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
export interface JoinMeetingViaActivityParams extends MutationParams {
  meetingId: string;
  activityId: string;
  simulateRateLimit?: boolean;
}

/**
 * @category Methods
 * @group Meetings
 */
export const JoinMeetingViaActivity = async ({
  meetingId,
  activityId,
  simulateRateLimit,
  clientApiParams,
}: JoinMeetingViaActivityParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/meetings/${meetingId}/activity/${activityId}`,
    {
      params: {
        simulateRateLimit: simulateRateLimit ? "true" : "false",
      },
    }
  );
  return data;
};

/**
 * @category Mutations
 * @group Meetings
 */
export const useJoinMeetingViaActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinMeetingViaActivity>>,
      Omit<JoinMeetingViaActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > & { simulateRateLimit?: boolean } = {}
) => {
  return useConnectedMutation<
    JoinMeetingViaActivityParams,
    Awaited<ReturnType<typeof JoinMeetingViaActivity>>
  >(
    (params) =>
      JoinMeetingViaActivity({
        ...params,
        simulateRateLimit: options.simulateRateLimit,
      }),
    options
  );
};
