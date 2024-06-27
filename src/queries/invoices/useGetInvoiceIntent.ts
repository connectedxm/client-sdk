import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { INVOICE_QUERY_KEY } from "./useGetInvoice";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_INVOICE_INTENT_QUERY_KEY = (invoiceId: string) => [
  ...INVOICE_QUERY_KEY(invoiceId),
  "INTENT",
];

export interface GetInvoiceIntentProps extends SingleQueryParams {
  invoiceId: string;
}

export const GetInvoiceIntent = async ({
  invoiceId,
  clientApiParams,
}: GetInvoiceIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/invoices/${invoiceId}/intent`);
  return data;
};

export const useGetInvoiceIntent = (
  invoiceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetInvoiceIntent>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetInvoiceIntent>>(
    SELF_INVOICE_INTENT_QUERY_KEY(invoiceId),
    (params) => GetInvoiceIntent({ invoiceId, ...params }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled: !!authenticated && !!invoiceId && (options?.enabled ?? true),
    }
  );
};
