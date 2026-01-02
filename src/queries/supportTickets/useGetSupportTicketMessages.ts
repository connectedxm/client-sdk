import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicketMessage } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "../useConnectedInfiniteQuery";
import { SUPPORT_TICKET_QUERY_KEY } from "./useGetSupportTicket";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Support Tickets
 */
export const SUPPORT_TICKET_MESSAGES_QUERY_KEY = (supportTicketId: string) => [
  ...SUPPORT_TICKET_QUERY_KEY(supportTicketId),
  "MESSAGES",
];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKET_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKET_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTicketMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SUPPORT_TICKET_MESSAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetSupportTicketMessagesProps extends InfiniteQueryParams {
  supportTicketId: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTicketMessages = async ({
  supportTicketId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSupportTicketMessagesProps): Promise<
  ConnectedXMResponse<SupportTicketMessage[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/supportTickets/${supportTicketId}/messages`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Support Tickets
 */
export const useGetSupportTicketMessages = (
  supportTicketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTicketMessages>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTicketMessages>>
  >(
    SUPPORT_TICKET_MESSAGES_QUERY_KEY(supportTicketId),
    (params: InfiniteQueryParams) =>
      GetSupportTicketMessages({
        supportTicketId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!supportTicketId && (options?.enabled ?? true),
    }
  );
};
