import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface CreateThreadMessageParams extends MutationParams {
  threadId: string;
  message: string;
}

export const CreateThreadMessage = async ({
  threadId,
  message,
  clientApiParams,
}: CreateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages`,
    { message }
  );

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
