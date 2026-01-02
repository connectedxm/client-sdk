import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, SupportTicket } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { SELF_QUERY_KEY } from "../self/useGetSelf";

/**
 * @category Keys
 * @group Support Tickets
 */
export const SUPPORT_TICKETS_QUERY_KEY = (
  type?: string,
  state?: string
): QueryKey => [...SELF_QUERY_KEY(), "SUPPORT_TICKETS", type, state];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTickets>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SUPPORT_TICKETS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetSupportTicketsProps extends InfiniteQueryParams {
  type?: string;
  state?: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTickets = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
  state,
  clientApiParams,
}: GetSupportTicketsProps): Promise<ConnectedXMResponse<SupportTicket[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/supportTickets`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type: type || undefined,
      state: state || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Support Tickets
 */
export const useGetSupportTickets = (
  type?: string,
  state?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTickets>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTickets>>
  >(
    SUPPORT_TICKETS_QUERY_KEY(type, state),
    (params: InfiniteQueryParams) =>
      GetSupportTickets({ type, state, ...params }),
    params,
    options
  );
};
