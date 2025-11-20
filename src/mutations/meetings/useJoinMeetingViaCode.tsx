import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import type { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface JoinMeetingViaCodeParams extends MutationParams {
  meetingId: string;
  code: string;
}

export const JoinMeetingViaCode = async ({
  meetingId,
  code,
  clientApiParams,
}: JoinMeetingViaCodeParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/meetings/${meetingId}/code/${code}`);
  return data;
};

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
