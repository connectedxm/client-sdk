import { ConnectedXMResponse, EventActivation } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_ATTENDEE_PASS_ACTIVATION_QUERY_KEY,
  EVENT_ATTENDEE_PASS_ACTIVATION_SUMMARY_QUERY_KEY,
  EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY,
} from "@src/queries";

export interface CompleteEventAttendeePassActivationParams extends MutationParams {
  eventId: string;
  passId: string;
  activationId: string;
  code?: string;
  imageId?: string;
  earnedPoints?: number;
}

export const CompleteEventAttendeePassActivation = async ({
  eventId,
  passId,
  activationId,
  code,
  imageId,
  earnedPoints,
  clientApiParams,
  queryClient,
}: CompleteEventAttendeePassActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations/${passId}/${activationId}`,
    {
      code: code || undefined,
      imageId: imageId || undefined,
      earnedPoints: earnedPoints ?? undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_ACTIVATION_SUMMARY_QUERY_KEY(
        eventId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_ACTIVATION_QUERY_KEY(
        eventId,
        passId,
        activationId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

export const useCompleteEventAttendeePassActivation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CompleteEventAttendeePassActivation>>,
      Omit<
        CompleteEventAttendeePassActivationParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CompleteEventAttendeePassActivationParams,
    Awaited<ReturnType<typeof CompleteEventAttendeePassActivation>>
  >(CompleteEventAttendeePassActivation, options);
};
