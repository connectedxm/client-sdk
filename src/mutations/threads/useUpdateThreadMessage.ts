import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SET_THREAD_MESSAGE_QUERY_DATA } from "@src/queries";

export interface UpdateThreadMessageParams extends MutationParams {
  threadId: string;
  messageId: string;
  body: string;
}

export const UpdateThreadMessage = async ({
  threadId,
  messageId,
  body,
  clientApiParams,
  queryClient,
}: UpdateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages/${messageId}`,
    { body }
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_MESSAGE_QUERY_DATA(queryClient, [threadId, messageId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useUpdateThreadMessage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateThreadMessage>>,
      Omit<UpdateThreadMessageParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadMessageParams,
    Awaited<ReturnType<typeof UpdateThreadMessage>>
  >(UpdateThreadMessage, options);
};
