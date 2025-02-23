import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MESSAGE_QUERY_KEY } from "@src/queries";

export interface DeleteThreadMessageParams extends MutationParams {
  threadId: string;
  messageId: string;
  body: string;
  moderator?: boolean;
}

export const DeleteThreadMessage = async ({
  threadId,
  messageId,
  body,
  moderator,
  clientApiParams,
  queryClient,
}: DeleteThreadMessageParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/threads/${threadId}/messages/${messageId}`,
    {
      data: { body, moderator },
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: THREAD_MESSAGE_QUERY_KEY(threadId, messageId),
    });
  }

  return data;
};

export const useDeleteThreadMessage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteThreadMessage>>,
      Omit<DeleteThreadMessageParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadMessageParams,
    Awaited<ReturnType<typeof DeleteThreadMessage>>
  >(DeleteThreadMessage, options);
};
