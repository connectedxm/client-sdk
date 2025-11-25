import { ConnectedXMResponse, SupportTicketMessage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { AppendInfiniteQuery } from "@src/utilities";
import { SUPPORT_TICKET_MESSAGES_QUERY_KEY } from "@src/queries/supportTickets";

/**
 * @category Params
 * @group SupportTickets
 */
export interface CreateSupportTicketMessageParams extends MutationParams {
  supportTicketId: string;
  message: string;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const CreateSupportTicketMessage = async ({
  supportTicketId,
  message,
  clientApiParams,
  queryClient,
}: CreateSupportTicketMessageParams): Promise<
  ConnectedXMResponse<SupportTicketMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<SupportTicketMessage>
  >(`/supportTickets/${supportTicketId}/messages`, {
    message,
  });

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<SupportTicketMessage>(
      queryClient,
      SUPPORT_TICKET_MESSAGES_QUERY_KEY(supportTicketId),
      data.data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
export const useCreateSupportTicketMessage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSupportTicketMessage>>,
      Omit<CreateSupportTicketMessageParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSupportTicketMessageParams,
    Awaited<ReturnType<typeof CreateSupportTicketMessage>>
  >(CreateSupportTicketMessage, options);
};
