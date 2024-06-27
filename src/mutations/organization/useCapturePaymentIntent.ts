import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import {
  INVOICE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface CapturePaymentIntentParams extends MutationParams {
  intent: PaymentIntent;
}

export const CapturePaymentIntent = async ({
  intent,
  clientApiParams,
  queryClient,
}: CapturePaymentIntentParams): Promise<ConnectedXMResponse<Activity>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/organization/intents/${intent.id}/capture`
  );

  if (queryClient && data.status === "ok") {
    if (intent.eventId && intent.registrationId) {
      queryClient.invalidateQueries({
        queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(intent.eventId),
      });

      queryClient.invalidateQueries({
        queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(intent.eventId),
      });

      if (intent.metadata?.purchaseId) {
        queryClient.invalidateQueries({
          // WE DONT HAVE THE EVENT SLUG SO WE MUST INVALIDATE BASED ON A PREDICATE
          predicate: ({ queryKey }) => {
            if (
              queryKey[queryKey.length - 3] === "PURCHASE" &&
              queryKey[queryKey.length - 2] === intent.metadata.purchaseId
            ) {
              return true;
            }
            return false;
          },
        });
      }
    }

    if (intent.invoiceId) {
      queryClient.invalidateQueries({
        queryKey: INVOICE_QUERY_KEY(intent.invoiceId),
      });
    }
  }

  return data;
};

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
