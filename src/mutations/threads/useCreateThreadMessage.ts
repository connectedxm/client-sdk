import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { AppendInfiniteQuery } from "@src/utilities";

export interface CreateThreadMessageParams extends MutationParams {
  threadId: string;
  body: string;
  entities: any[];
}

export const CreateThreadMessage = async ({
  threadId,
  body,
  entities,
  clientApiParams,
  queryClient,
}: CreateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads/${threadId}/messages`, {
    body,
    entities,
  });

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<ThreadMessage>(
      queryClient,
      THREAD_MESSAGES_QUERY_KEY(threadId),
      data.data
    );
  }

  return data;
};

export const useCreateThreadMessage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof CreateThreadMessage>>,
    Omit<CreateThreadMessageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageParams,
    Awaited<ReturnType<typeof CreateThreadMessage>>
  >(CreateThreadMessage, options);
};
