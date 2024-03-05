import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Invoice } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const INVOICE_QUERY_KEY = (invoiceId: string): QueryKey => [
  "INVOICES",
  invoiceId,
];

export const SET_INVOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoice>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...INVOICE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetInvoiceProps extends SingleQueryParams {
  invoiceId: string;
}

export const GetInvoice = async ({
  invoiceId,
  clientApiParams,
}: GetInvoiceProps): Promise<ConnectedXMResponse<Invoice>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/invoices/${invoiceId}`);
  return data;
};

export const useGetInvoice = (
  invoiceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetInvoice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInvoice>>(
    INVOICE_QUERY_KEY(invoiceId),
    (params) => GetInvoice({ invoiceId, ...params }),
    {
      ...options,
      enabled: !!invoiceId && (options?.enabled ?? true),
    }
  );
};
