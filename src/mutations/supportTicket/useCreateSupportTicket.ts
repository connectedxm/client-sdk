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
import { SupportTicketCreateInputs } from "@src/params";

export interface CreateSupportTicketParams extends MutationParams {
  supportTicket: SupportTicketCreateInputs;
  eventId?: string;
  productId?: string;
}

export const CreateSupportTicket = async ({
  supportTicket: { type, email, request },
  eventId,
  productId,
  clientApiParams,
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

  return data;
};

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
