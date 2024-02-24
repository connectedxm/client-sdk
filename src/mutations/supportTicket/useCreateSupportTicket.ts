import { ConnectedXMResponse, SupportTicket } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

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
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
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
  >(CreateSupportTicket, params, options);
};
