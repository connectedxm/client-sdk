import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { SET_THREAD_MESSAGE_QUERY_DATA } from "@src/queries/threads/useGetThreadMessage";

export interface RemoveThreadMessageVideoParams extends MutationParams {
  threadId: string;
  messageId: string;
  videoId: string;
}

export const RemoveThreadMessageVideo = async ({
  threadId,
  messageId,
  videoId,
  clientApiParams,
  queryClient,
}: RemoveThreadMessageVideoParams): Promise<
  ConnectedXMResponse<ThreadMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/threads/${threadId}/messages/${messageId}/videos/${videoId}`
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_MESSAGE_QUERY_DATA(queryClient, [threadId, messageId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useRemoveThreadMessageVideo = (
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveThreadMessageVideo>>,
    Omit<RemoveThreadMessageVideoParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadMessageVideoParams,
    Awaited<ReturnType<typeof RemoveThreadMessageVideo>>
  >(RemoveThreadMessageVideo, options);
};
