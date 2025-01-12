import { ConnectedXMResponse, EventActivation } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_ACTIVATION_QUERY_KEY } from "@src/queries/events/useGetEventActivation";
import { EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY } from "@src/queries/events/useGetEventActivationCompletions";
import { EVENT_ACTIVATION_SUMMARY_QUERY_KEY } from "@src/queries/events/useGetEventActivationSummary";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "@src/queries";

export interface CompleteEventActivationParams extends MutationParams {
  eventId: string;
  activationId: string;
  code?: string;
}

export const CompleteEventActivation = async ({
  eventId,
  activationId,
  code,
  clientApiParams,
  queryClient,
}: CompleteEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations/${activationId}`,
    {
      code: code || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_SUMMARY_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_QUERY_KEY(eventId, activationId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
    });
  }

  return data;
};

export const useCompleteEventActivation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CompleteEventActivation>>,
      Omit<CompleteEventActivationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CompleteEventActivationParams,
    Awaited<ReturnType<typeof CompleteEventActivation>>
  >(CompleteEventActivation, options);
};
