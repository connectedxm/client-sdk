import { ConnectedXMResponse, SupportTicket } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  SET_SUPPORT_TICKET_QUERY_DATA,
  SUPPORT_TICKETS_QUERY_KEY,
} from "@src/queries/supportTickets";
import { AppendInfiniteQuery } from "@src/utilities";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";

/**
 * @category Params
 * @group SupportTickets
 */
export interface CreateSupportTicketParams extends MutationParams {
  type: string;
  request: string;
  eventId?: string | null;
  firstMessage?: string | null;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const CreateSupportTicket = async ({
  type,
  request,
  eventId,
  firstMessage,
  clientApiParams,
  queryClient,
}: CreateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<SupportTicket>>(
    "/supportTickets",
    {
      type,
      request,
      ...(eventId !== undefined && eventId !== null && { eventId }),
      ...(firstMessage !== undefined &&
        firstMessage !== null && { firstMessage }),
    }
  );

  if (queryClient && data.status === "ok") {
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [data.data.id], data, [
      clientApiParams.locale,
    ]);

    AppendInfiniteQuery<SupportTicket>(
      queryClient,
      [
        ...SUPPORT_TICKETS_QUERY_KEY(type, data.data.state),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ],
      data.data
    );

    AppendInfiniteQuery<SupportTicket>(
      queryClient,
      [
        ...SUPPORT_TICKETS_QUERY_KEY(),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ],
      data.data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
export const useCreateSupportTicket = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSupportTicket>>,
      Omit<CreateSupportTicketParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSupportTicketParams,
    Awaited<ReturnType<typeof CreateSupportTicket>>
  >(CreateSupportTicket, options);
};
