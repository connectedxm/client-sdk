import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import type { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface JoinMeetingViaEventParams extends MutationParams {
  meetingId: string;
  eventId: string;
}

export const JoinMeetingViaEvent = async ({
  meetingId,
  eventId,
  clientApiParams,
}: JoinMeetingViaEventParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/meetings/${meetingId}/event/${eventId}`
  );
  return data;
};

export const useJoinMeetingViaEvent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinMeetingViaEvent>>,
      Omit<JoinMeetingViaEventParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    JoinMeetingViaEventParams,
    Awaited<ReturnType<typeof JoinMeetingViaEvent>>
  >(JoinMeetingViaEvent, options);
};
