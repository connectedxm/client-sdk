import { ConnectedXMResponse, SupportTicket } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

export interface CreateSupportTicketParams extends MutationParams {
  type: "support" | "inquiry";
  email: string;
  request: any;
  eventId?: string;
  productId?: string;
}

export const CreateSupportTicket = async ({
  type,
  email,
  request,
  eventId,
  productId,
  clientApi,
}: CreateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof CreateSupportTicket>>,
    CreateSupportTicketParams
  > = {}
) => {
  return useConnectedMutation<
    CreateSupportTicketParams,
    Awaited<ReturnType<typeof CreateSupportTicket>>
  >(CreateSupportTicket, params, options);
};
