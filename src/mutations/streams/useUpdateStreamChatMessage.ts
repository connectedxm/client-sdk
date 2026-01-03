import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, StreamChatMessage } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { STREAM_CHAT_MESSAGES_QUERY_KEY } from "@src/queries/streams/useGetStreamChatMessages";
import { GetBaseInfiniteQueryKeys } from "@src/queries";
import { InfiniteData } from "@tanstack/react-query";
import { produce } from "immer";

export interface UpdateStreamChatMessageParams extends MutationParams {
  streamId: string;
  sessionId: string;
  messageId: string;
  message: string;
}

export const UpdateStreamChatMessage = async ({
  streamId,
  sessionId,
  messageId,
  message,
  clientApiParams,
  queryClient,
}: UpdateStreamChatMessageParams): Promise<
  ConnectedXMResponse<StreamChatMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put(
    `/streams/${streamId}/sessions/${sessionId}/messages/${messageId}`,
    {
      message,
    }
  );

  if (queryClient && data.status === "ok") {
    const QueryKey = [
      ...STREAM_CHAT_MESSAGES_QUERY_KEY(streamId, sessionId),
      ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
    ];

    queryClient.setQueryData(
      QueryKey,
      (oldData: InfiniteData<ConnectedXMResponse<StreamChatMessage[]>>) => {
        return produce(oldData, (draft) => {
          if (draft?.pages) {
            for (const page of draft.pages) {
              if (page?.data) {
                const index = page.data.findIndex(
                  (msg) => msg.messageId === messageId
                );
                if (index !== -1) {
                  page.data[index] = data.data;
                  break;
                }
              }
            }
          }
        });
      }
    );
  }

  return data;
};

export const useUpdateStreamChatMessage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateStreamChatMessage>>,
    Omit<UpdateStreamChatMessageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    UpdateStreamChatMessageParams,
    Awaited<ReturnType<typeof UpdateStreamChatMessage>>
  >(UpdateStreamChatMessage, options);
};

