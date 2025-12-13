import { ConnectedXMResponse, EventActivation } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_ACTIVATION_QUERY_KEY } from "@src/queries/events/useGetEventActivation";
import { EVENT_ACTIVATION_SUMMARY_QUERY_KEY } from "@src/queries/events/useGetEventActivationSummary";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface CompleteEventActivationParams extends MutationParams {
  eventId: string;
  passId: string;
  activationId: string;
  code?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CompleteEventActivation = async ({
  eventId,
  passId,
  activationId,
  code,
  clientApiParams,
  queryClient,
}: CompleteEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations/${passId}/${activationId}`,
    {
      code: code || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_SUMMARY_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_QUERY_KEY(eventId, passId, activationId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATIONS_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
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
