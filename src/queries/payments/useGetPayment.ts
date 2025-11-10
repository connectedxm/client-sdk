import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Payment } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { PAYMENTS_QUERY_KEY } from "./useGetPayments";

export const PAYMENT_QUERY_KEY = (paymentId: string): QueryKey => [
  ...PAYMENTS_QUERY_KEY(),
  paymentId,
];

export const SET_PAYMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PAYMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPayment>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...PAYMENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetPaymentProps extends SingleQueryParams {
  paymentId: string;
}

export const GetPayment = async ({
  paymentId,
  clientApiParams,
}: GetPaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/payments/${paymentId}`);
  return data;
};

export const useGetPayment = (
  paymentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetPayment>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetPayment>>(
    PAYMENT_QUERY_KEY(paymentId),
    (params) => GetPayment({ paymentId, ...params }),
    {
      ...options,
      enabled: !!paymentId && (options?.enabled ?? true),
    }
  );
};
