import {
  ConnectedXMResponse,
  SupportTicket,
  SupportTicketType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SUPPORT_TICKETS_QUERY_KEY } from "@src/queries/supportTickets";
import { AppendInfiniteQuery } from "@src/utilities";

/**
 * @category Params
 * @group SupportTickets
 */
export interface CreateSupportTicketParams extends MutationParams {
  type: keyof typeof SupportTicketType;
  email: string;
  request: string;
  eventId?: string;
  productId?: string;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const CreateSupportTicket = async ({
  type,
  email,
  request,
  eventId,
  productId,
  clientApiParams,
  queryClient,
}: CreateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<SupportTicket>>(
    "/supportTickets",
    {
      type,
      email,
      request,
      eventId: eventId || undefined,
      productId: productId || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<SupportTicket>(
      queryClient,
      SUPPORT_TICKETS_QUERY_KEY(),
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
