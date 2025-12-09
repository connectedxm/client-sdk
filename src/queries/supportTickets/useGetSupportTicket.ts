import { GetClientAPI } from "@src/ClientAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicket } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Support Tickets
 */
export const SUPPORT_TICKET_QUERY_KEY = (supportTicketId: string) => [
  "SUPPORT_TICKETS",
  supportTicketId,
];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKET_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKET_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTicket>>
) => {
  client.setQueryData(SUPPORT_TICKET_QUERY_KEY(...keyParams), response);
};

interface GetSupportTicketProps extends SingleQueryParams {
  supportTicketId: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTicket = async ({
  supportTicketId,
  clientApiParams,
}: GetSupportTicketProps): Promise<ConnectedXMResponse<SupportTicket>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/supportTickets/${supportTicketId}`);
  return data;
};
/**
 * @category Hooks
 * @group Support Tickets
 */
export const useGetSupportTicket = (
  supportTicketId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSupportTicket>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSupportTicket>>(
    SUPPORT_TICKET_QUERY_KEY(supportTicketId),
    (params: SingleQueryParams) =>
      GetSupportTicket({ supportTicketId, ...params }),
    {
      ...options,
      enabled: !!supportTicketId && (options?.enabled ?? true),
    }
  );
};
