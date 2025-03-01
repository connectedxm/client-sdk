import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Thread, ThreadMessage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  GetBaseInfiniteQueryKeys,
  GetBaseSingleQueryKeys,
  SET_THREAD_MESSAGE_QUERY_DATA,
  THREAD_MESSAGES_QUERY_KEY,
  THREAD_QUERY_KEY,
} from "@src/queries";
import { AppendInfiniteQuery } from "@src/utilities";

export interface CreateThreadMessageParams extends MutationParams {
  threadId: string;
  message: string;
}

export const CreateThreadMessage = async ({
  threadId,
  message,
  clientApiParams,
  queryClient,
}: CreateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages`,
    { message }
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_MESSAGE_QUERY_DATA(queryClient, [threadId, data.data.id], data);

    AppendInfiniteQuery<ThreadMessage>(
      queryClient,
      [
        ...THREAD_MESSAGES_QUERY_KEY(threadId),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ],
      data.data
    );

    // Update the thread query data
    queryClient.setQueryData(
      [
        ...THREAD_QUERY_KEY(threadId),
        ...GetBaseSingleQueryKeys(clientApiParams.locale),
      ],
      (oldData: ConnectedXMResponse<Thread>) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            lastMessageAt: data.data.sentAt,
            lastMessage: data.data.body,
          },
        } as ConnectedXMResponse<Thread>;
      }
    );
  }

  return data;
};

export const useCreateThreadMessage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateThreadMessage>>,
      Omit<CreateThreadMessageParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageParams,
    Awaited<ReturnType<typeof CreateThreadMessage>>
  >(CreateThreadMessage, options);
};
