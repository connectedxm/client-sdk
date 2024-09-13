import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  GetBaseInfiniteQueryKeys,
  THREAD_MESSAGE_REPLIES_QUERY_KEY,
} from "@src/queries";
import { AppendInfiniteQuery } from "@src/utilities";

export interface AddThreadMessageReplyParams extends MutationParams {
  threadId: string;
  messageId: string;
  body: string;
}

export const AddThreadMessageReply = async ({
  threadId,
  messageId,
  body,
  clientApiParams,
  queryClient,
}: AddThreadMessageReplyParams): Promise<
  ConnectedXMResponse<ThreadMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages/${messageId}/replies`,
    { body }
  );

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<ThreadMessage>(
      queryClient,
      [
        ...THREAD_MESSAGE_REPLIES_QUERY_KEY(threadId, messageId),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ],
      data.data
    );
  }

  return data;
};

export const useAddThreadMessageReply = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddThreadMessageReply>>,
      Omit<AddThreadMessageReplyParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddThreadMessageReplyParams,
    Awaited<ReturnType<typeof AddThreadMessageReply>>
  >(AddThreadMessageReply, options);
};
