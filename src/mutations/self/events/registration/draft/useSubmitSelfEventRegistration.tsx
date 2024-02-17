import { Registration } from "@context/interfaces";
import { QUERY_KEY as EVENT_REGISTRATION } from "@context/queries/self/registration/useGetSelfEventRegistration";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

import useConnectedMutation, {
  MutationParams,
} from "../../../../useConnectedMutation";

interface SubmitStripe {
  type: "stripe";
  paymentMethodId: string;
}

interface SubmitPaypal {
  type: "paypal";
  orderId: string;
}

export type SubmitPayment = SubmitStripe | SubmitPaypal;

export interface SubmitStripeResponse {
  status: string;
  clientSecret: string;
  registration: Registration;
}

export interface SubmitPaypalResponse {
  registration: Registration;
}

export type SubmitResponse = SubmitStripeResponse | SubmitPaypalResponse;

export interface SubmitSelfEventRegistrationParams extends MutationParams {
  eventId: string;
  registrationId: string;
  payment?: SubmitPayment;
}

export const SubmitSelfEventRegistration = async ({
  eventId,
  registrationId,
  payment,
}: SubmitSelfEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/events/${eventId}/registration/${registrationId}/draft/submit`,
    payment
  );

  return data;
};

export const useSubmitSelfEventRegistration = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (payment?: SubmitPayment) =>
      SubmitSelfEventRegistration({
        eventId,
        registrationId,
        payment,
      }),
    {
      onSuccess: async (
        response: Awaited<ReturnType<typeof SubmitSelfEventRegistration>>
      ) => {
        queryClient.setQueryData([EVENT_REGISTRATION, eventId], response);
      },
    }
  );
};

export default useSubmitSelfEventRegistration;
