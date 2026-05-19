import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { SET_THREAD_MESSAGE_QUERY_DATA } from "@src/queries/threads/useGetThreadMessage";

export interface RemoveThreadMessageFileParams extends MutationParams {
  threadId: string;
  messageId: string;
  fileId: number;
}

export const RemoveThreadMessageFile = async ({
  threadId,
  messageId,
  fileId,
  clientApiParams,
  queryClient,
}: RemoveThreadMessageFileParams): Promise<
  ConnectedXMResponse<ThreadMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/threads/${threadId}/messages/${messageId}/files/${fileId}`
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_MESSAGE_QUERY_DATA(queryClient, [threadId, messageId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useRemoveThreadMessageFile = (
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveThreadMessageFile>>,
    Omit<RemoveThreadMessageFileParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadMessageFileParams,
    Awaited<ReturnType<typeof RemoveThreadMessageFile>>
  >(RemoveThreadMessageFile, options);
};
