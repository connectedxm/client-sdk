import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import type { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface JoinMeetingViaBookingParams extends MutationParams {
  meetingId: string;
  bookingId: string;
  simulateRateLimit?: boolean;
}

export const JoinMeetingViaBooking = async ({
  meetingId,
  bookingId,
  simulateRateLimit,
  clientApiParams,
}: JoinMeetingViaBookingParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/meetings/${meetingId}/booking/${bookingId}`,
    {
      params: {
        simulateRateLimit: simulateRateLimit ? "true" : "false",
      },
    }
  );
  return data;
};

export const useJoinMeetingViaBooking = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinMeetingViaBooking>>,
      Omit<JoinMeetingViaBookingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > & { simulateRateLimit?: boolean } = {}
) => {
  return useConnectedMutation<
    JoinMeetingViaBookingParams,
    Awaited<ReturnType<typeof JoinMeetingViaBooking>>
  >(
    (params) =>
      JoinMeetingViaBooking({
        ...params,
        simulateRateLimit: options.simulateRateLimit,
      }),
    options
  );
};
