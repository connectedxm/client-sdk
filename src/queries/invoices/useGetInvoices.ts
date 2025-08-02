import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, Invoice } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const INVOICES_QUERY_KEY = (): QueryKey => {
  const key = ["INVOICES"];
  return key;
};

export interface GetInvoicesProps extends InfiniteQueryParams {}

export const GetInvoices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetInvoicesProps): Promise<ConnectedXMResponse<Invoice[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/invoices`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetInvoices = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetInvoices>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInvoices>>>(
    INVOICES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetInvoices(params),
    params,
    options
  );
};
