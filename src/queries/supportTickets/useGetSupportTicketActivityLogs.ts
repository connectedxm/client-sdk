import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicketActivityLog } from "@src/interfaces";
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
export const SUPPORT_TICKET_ACTIVITY_LOG_QUERY_KEY = (
  supportTicketId: string
) => [...SUPPORT_TICKET_QUERY_KEY(supportTicketId), "ACTIVITY_LOG"];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKET_ACTIVITY_LOG_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKET_ACTIVITY_LOG_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTicketActivityLog>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SUPPORT_TICKET_ACTIVITY_LOG_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetSupportTicketActivityLogProps extends InfiniteQueryParams {
  supportTicketId: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTicketActivityLog = async ({
  supportTicketId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSupportTicketActivityLogProps): Promise<
  ConnectedXMResponse<SupportTicketActivityLog[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/supportTickets/${supportTicketId}/activityLog`,
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
export const useGetSupportTicketActivityLog = (
  supportTicketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTicketActivityLog>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTicketActivityLog>>
  >(
    SUPPORT_TICKET_ACTIVITY_LOG_QUERY_KEY(supportTicketId),
    (params: InfiniteQueryParams) =>
      GetSupportTicketActivityLog({
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
