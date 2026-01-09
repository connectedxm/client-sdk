import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, Payment } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { INVOICE_QUERY_KEY } from "./useGetInvoice";

export const INVOICE_PAYMENTS_QUERY_KEY = (invoiceId: string): QueryKey => {
  const key = [...INVOICE_QUERY_KEY(invoiceId), "PAYMENTS"];
  return key;
};

export interface GetInvoicePaymentsProps extends InfiniteQueryParams {
  invoiceId: string;
}

export const GetInvoicePayments = async ({
  invoiceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetInvoicePaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/invoices/${invoiceId}/payments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetInvoicePayments = (
  invoiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInvoicePayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInvoicePayments>>
  >(
    INVOICE_PAYMENTS_QUERY_KEY(invoiceId),
    (queryParams: InfiniteQueryParams) =>
      GetInvoicePayments({ invoiceId, ...queryParams }),
    params,
    {
      ...options,
      enabled: !!invoiceId && (options?.enabled ?? true),
    }
  );
};
