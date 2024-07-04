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
import { InfiniteData } from "@tanstack/react-query";
import { produce } from "immer";

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
    queryClient.setQueryData(
      [
        ...THREAD_MESSAGES_QUERY_KEY(threadId),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ],
      (oldData: InfiniteData<ConnectedXMResponse<ThreadMessage[]>>) => {
        if (!oldData) return oldData;
        return produce(oldData, (draft) => {
          draft.pages.forEach((page) => {
            const index = page.data.findIndex((m) => m.id === messageId);
            if (index !== -1) {
              page.data.splice(index, 1);
            }
          });
        });
      }
    );
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
