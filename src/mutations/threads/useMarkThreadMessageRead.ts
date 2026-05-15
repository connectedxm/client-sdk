import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";

export interface MarkThreadMessageReadParams extends MutationParams {
  threadId: string;
  messageId: string;
}

export const MarkThreadMessageRead = async ({
  threadId,
  messageId,
  clientApiParams,
}: MarkThreadMessageReadParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/threads/${threadId}/messages/${messageId}/read`
  );

  return data;
};

export const useMarkThreadMessageRead = (
  options: MutationOptions<
    Awaited<ReturnType<typeof MarkThreadMessageRead>>,
    Omit<MarkThreadMessageReadParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    MarkThreadMessageReadParams,
    Awaited<ReturnType<typeof MarkThreadMessageRead>>
  >(MarkThreadMessageRead, options);
};
