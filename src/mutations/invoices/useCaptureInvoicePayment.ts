import { ConnectedXMResponse, Invoice } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SET_INVOICE_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface CaptureInvoicePaymentParams extends MutationParams {
  invoiceId: string;
  intentId: string;
}

export const CaptureInvoicePayment = async ({
  invoiceId,
  intentId,
  clientApiParams,
  queryClient,
}: CaptureInvoicePaymentParams): Promise<ConnectedXMResponse<Invoice>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Invoice>>(
    `/invoices/${invoiceId}/capture`,
    {
      intentId,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_INVOICE_QUERY_DATA(queryClient, [invoiceId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useCaptureInvoicePayment = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CaptureInvoicePayment>>,
      Omit<CaptureInvoicePaymentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CaptureInvoicePaymentParams,
    Awaited<ReturnType<typeof CaptureInvoicePayment>>
  >(CaptureInvoicePayment, options);
};
