import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import {
  SELF_EVENT_ATTENDEE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";

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
  payment?: SubmitPayment;
}

export const SubmitSelfEventRegistration = async ({
  eventId,
  payment,
  clientApiParams,
  queryClient,
}: SubmitSelfEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/submit`,
    payment
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "events",
      eventId
    );
  }

  return data;
};

export const useSubmitSelfEventRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSelfEventRegistration>>,
      Omit<SubmitSelfEventRegistrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSelfEventRegistrationParams,
    Awaited<ReturnType<typeof SubmitSelfEventRegistration>>
  >(SubmitSelfEventRegistration, options);
};
