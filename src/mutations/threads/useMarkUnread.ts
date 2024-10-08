import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Thread } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_QUERY_KEY } from "@src/queries";

export interface MarkUnreadParams extends MutationParams {
  threadId: string;
}

export const MarkUnread = async ({
  threadId,
  clientApiParams,
  queryClient,
}: MarkUnreadParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/threads/${threadId}/unread`
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(
      [...THREAD_QUERY_KEY(threadId), clientApiParams.locale],
      (oldData: Thread) => {
        if (!oldData) {
          return oldData;
        }
        return {
          ...oldData,
          read: false,
        };
      }
    );
  }

  return data;
};

export const useMarkUnread = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof MarkUnread>>,
      Omit<MarkUnreadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    MarkUnreadParams,
    Awaited<ReturnType<typeof MarkUnread>>
  >(MarkUnread, options);
};
