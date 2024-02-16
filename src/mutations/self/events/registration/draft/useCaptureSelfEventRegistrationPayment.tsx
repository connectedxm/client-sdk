import { Registration } from "@context/interfaces";
import { QUERY_KEY as EVENT_REGISTRATION } from "@context/queries/self/registration/useGetSelfEventRegistration";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

import useConnectedMutation, {
  MutationParams,
} from "../../../../useConnectedMutation";

interface CaptureSelfEventRegistrationPaymentParams extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const CaptureSelfEventRegistrationPayment = async ({
  eventId,
  registrationId,
}: CaptureSelfEventRegistrationPaymentParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/events/${eventId}/registration/${registrationId}/draft/capture`
  );

  return data;
};

export const useCaptureSelfEventRegistrationPayment = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    () =>
      CaptureSelfEventRegistrationPayment({
        eventId,
        registrationId,
      }),
    {
      onSuccess: async (
        response: Awaited<
          ReturnType<typeof CaptureSelfEventRegistrationPayment>
        >
      ) => {
        queryClient.setQueryData([EVENT_REGISTRATION, eventId], response);
      },
    }
  );
};

export default useCaptureSelfEventRegistrationPayment;
