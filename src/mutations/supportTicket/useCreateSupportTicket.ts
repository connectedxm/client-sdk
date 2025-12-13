import {
  ConnectedXMResponse,
  SupportTicket,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SupportTicketCreateInputs } from "@src/params";

/**
 * @category Params
 * @group SupportTicket
 */
export interface CreateSupportTicketParams extends MutationParams {
  ticket: SupportTicketCreateInputs;
}

/**
 * @category Methods
 * @group SupportTicket
 */
export const CreateSupportTicket = async ({
  ticket,
  clientApiParams,
}: CreateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<SupportTicket>>(
    "/supportTickets",
    {
      type: ticket.type,
      email: ticket.email,
      request: ticket.request,
      eventId: ticket.eventId || undefined,
      productId: ticket.productId || undefined,
    }
  );

  return data;
};

/**
 * @category Mutations
 * @group SupportTicket
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
