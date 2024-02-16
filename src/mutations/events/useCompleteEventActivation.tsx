import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Purchase } from "@context/interfaces";
import { QUERY_KEY as EVENT_ACTIVATION } from "@context/queries/events/useGetEventActivation";
import { QUERY_KEY as EVENT_ACTIVATION_COMPLETIONS } from "@context/queries/events/useGetEventActivationCompletions";
import { QUERY_KEY as EVENT_ACTIVATIONS_SUMMARY } from "@context/queries/self/useGetSelfEventActivationsSummary";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface CompleteEventActivationParams extends MutationParams {
  eventId: string;
  activationId: string;
  code?: string;
}

export const CompleteEventActivation = async ({
  eventId,
  activationId,
  code,
}: CompleteEventActivationParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/activations/${activationId}`,
    {
      code: code || undefined,
    },
  );
  return data;
};

export const useCompleteEventActivation = (
  eventId: string,
  activationId: string,
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    (params: Omit<CompleteEventActivationParams, "eventId" | "activationId">) =>
      CompleteEventActivation({ eventId, activationId, ...params }),
    {
      onSuccess: (_response: ConnectedXMResponse<Purchase>) => {
        queryClient.invalidateQueries([
          EVENT_ACTIVATION,
          eventId,
          activationId,
        ]);
        queryClient.invalidateQueries([
          EVENT_ACTIVATION_COMPLETIONS,
          eventId,
          activationId,
        ]);
        queryClient.invalidateQueries([EVENT_ACTIVATIONS_SUMMARY, eventId]);
      },
    },
  );
};

export default useCompleteEventActivation;
