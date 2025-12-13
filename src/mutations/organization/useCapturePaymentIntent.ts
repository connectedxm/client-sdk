import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import {
  ADD_SELF_RELATIONSHIP,
  BOOKINGS_QUERY_KEY,
  INVOICE_QUERY_KEY,
  EVENT_REGISTRATION_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";
import { PaymentIntentCaptureInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface CapturePaymentIntentParams extends MutationParams {
  intent: PaymentIntent;
  paymentDetails: PaymentIntentCaptureInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const CapturePaymentIntent = async ({
  intent,
  paymentDetails,
  clientApiParams,
  queryClient,
}: CapturePaymentIntentParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/organization/intents/${intent.id}/capture`,
    {
      nonce: paymentDetails.nonce || undefined,
      deviceData: paymentDetails.deviceData || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      predicate: ({ queryKey }) => queryKey.includes("INTENT"),
    });

    if (intent.eventId) {
      queryClient.removeQueries({
        queryKey: EVENT_REGISTRATION_QUERY_KEY(intent.eventId),
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_QUERY_KEY(intent.eventId),
        exact: false,
      });

      ADD_SELF_RELATIONSHIP(
        queryClient,
        [clientApiParams.locale],
        "events",
        intent.eventId
      );

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes("SESSION_REGISTRATION"),
      });
    }

    if (intent.invoiceId) {
      queryClient.invalidateQueries({
        queryKey: INVOICE_QUERY_KEY(intent.invoiceId),
      });
    }

    if (intent.bookingId) {
      queryClient.invalidateQueries({
        queryKey: BOOKINGS_QUERY_KEY(),
      });
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes("SLOTS"),
      });
    }
  }

  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useCapturePaymentIntent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CapturePaymentIntent>>,
      Omit<CapturePaymentIntentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CapturePaymentIntentParams,
    Awaited<ReturnType<typeof CapturePaymentIntent>>
  >(CapturePaymentIntent, options);
};
