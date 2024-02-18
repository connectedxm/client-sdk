import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";

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
  clientApi,
  queryClient,
  locale = "en",
}: SubmitSelfEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/submit`,
    payment
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
  }

  return data;
};

export const useSubmitSelfEventRegistration = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSelfEventRegistration>>,
      Omit<SubmitSelfEventRegistrationParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSelfEventRegistrationParams,
    Awaited<ReturnType<typeof SubmitSelfEventRegistration>>
  >(SubmitSelfEventRegistration, params, options);
};
