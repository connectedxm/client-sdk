import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, Payment } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const PAYMENTS_QUERY_KEY = (): QueryKey => {
  const key = ["PAYMENTS"];
  return key;
};

export interface GetPaymentsProps extends InfiniteQueryParams {}

export const GetPayments = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/payments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetPayments = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetPayments>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetPayments>>>(
    PAYMENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetPayments(params),
    params,
    options
  );
};
