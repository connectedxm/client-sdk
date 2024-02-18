import { ConnectedXMResponse, EventActivation } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";

export interface CompleteEventActivationParams extends MutationParams {
  eventId: string;
  activationId: string;
  code?: string;
}

export const CompleteEventActivation = async ({
  eventId,
  activationId,
  code,
  clientApi,
  queryClient,
}: CompleteEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const { data } = await clientApi.post<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations/${activationId}`,
    {
      code: code || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    // TODO: QUERIES NEED TO BE ADDED
    // queryClient.invalidateQueries({
    //   queryKey: EVENT_ACTIVATION_QUERY_KEY(eventId, activationId),
    // });
    // queryClient.invalidateQueries([
    //   EVENT_ACTIVATION_COMPLETIONS,
    //   eventId,
    //   activationId,
    // ]);
    // queryClient.invalidateQueries([EVENT_ACTIVATIONS_SUMMARY, eventId]);
  }

  return data;
};

export const useCompleteEventActivation = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CompleteEventActivation>>,
      Omit<CompleteEventActivationParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CompleteEventActivationParams,
    Awaited<ReturnType<typeof CompleteEventActivation>>
  >(CompleteEventActivation, params, options);
};
