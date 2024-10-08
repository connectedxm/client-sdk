import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  GetBaseInfiniteQueryKeys,
  THREAD_MESSAGES_QUERY_KEY,
} from "@src/queries";
import { AppendInfiniteQuery } from "@src/utilities";

export interface CreateThreadMessageParams extends MutationParams {
  threadId: string;
  body: string;
}

export const CreateThreadMessage = async ({
  threadId,
  body,
  clientApiParams,
  queryClient,
}: CreateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages`,
    { body }
  );

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<ThreadMessage>(
      queryClient,
      [
        ...THREAD_MESSAGES_QUERY_KEY(threadId),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ],
      data.data
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
