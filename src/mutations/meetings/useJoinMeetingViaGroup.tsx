import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import type { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface JoinMeetingViaGroupParams extends MutationParams {
  meetingId: string;
  groupId: string;
  simulateRateLimit?: boolean;
}

export const JoinMeetingViaGroup = async ({
  meetingId,
  groupId,
  simulateRateLimit,
  clientApiParams,
}: JoinMeetingViaGroupParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/meetings/${meetingId}/group/${groupId}`,
    {
      params: {
        simulateRateLimit: simulateRateLimit ? "true" : "false",
      },
    }
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
  > & { simulateRateLimit?: boolean } = {}
) => {
  return useConnectedMutation<
    JoinMeetingViaGroupParams,
    Awaited<ReturnType<typeof JoinMeetingViaGroup>>
  >(
    (params) =>
      JoinMeetingViaGroup({
        ...params,
        simulateRateLimit: options.simulateRateLimit,
      }),
    options
  );
};
