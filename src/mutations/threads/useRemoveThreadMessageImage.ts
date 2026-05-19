import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { SET_THREAD_MESSAGE_QUERY_DATA } from "@src/queries/threads/useGetThreadMessage";

export interface RemoveThreadMessageImageParams extends MutationParams {
  threadId: string;
  messageId: string;
  imageId: string;
}

export const RemoveThreadMessageImage = async ({
  threadId,
  messageId,
  imageId,
  clientApiParams,
  queryClient,
}: RemoveThreadMessageImageParams): Promise<
  ConnectedXMResponse<ThreadMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/threads/${threadId}/messages/${messageId}/images/${imageId}`
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_MESSAGE_QUERY_DATA(queryClient, [threadId, messageId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useRemoveThreadMessageImage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveThreadMessageImage>>,
    Omit<RemoveThreadMessageImageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadMessageImageParams,
    Awaited<ReturnType<typeof RemoveThreadMessageImage>>
  >(RemoveThreadMessageImage, options);
};
