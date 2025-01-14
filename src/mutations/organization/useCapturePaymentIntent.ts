import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP, INVOICE_QUERY_KEY } from "@src/queries";

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
    if (intent.eventId) {
      queryClient.removeQueries({
        queryKey: ["SELF", "REGISTRATION"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["SELF", "ATTENDEE"],
        exact: false,
      });

      ADD_SELF_RELATIONSHIP(
        queryClient,
        [clientApiParams.locale],
        "events",
        intent.eventId
      );
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
