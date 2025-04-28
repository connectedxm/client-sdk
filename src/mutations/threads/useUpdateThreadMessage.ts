import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MESSAGE_QUERY_KEY } from "@src/queries";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

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
    SetSingleQueryData(
      queryClient,
      THREAD_MESSAGE_QUERY_KEY(threadId, messageId),
      clientApiParams.locale,
      data
    );
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
