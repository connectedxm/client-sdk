import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";

export interface SendThreadTypingParams extends MutationParams {
  threadId: string;
}

export const SendThreadTyping = async ({
  threadId,
  clientApiParams,
}: SendThreadTypingParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads/${threadId}/typing`, {});

  return data;
};

export const useSendThreadTyping = (
  options: MutationOptions<
    Awaited<ReturnType<typeof SendThreadTyping>>,
    Omit<SendThreadTypingParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    SendThreadTypingParams,
    Awaited<ReturnType<typeof SendThreadTyping>>
  >(SendThreadTyping, options);
};
