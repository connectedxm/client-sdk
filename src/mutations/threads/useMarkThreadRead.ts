import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";

export interface MarkThreadReadParams extends MutationParams {
  threadId: string;
  messageId?: string;
}

export const MarkThreadRead = async ({
  threadId,
  messageId,
  clientApiParams,
}: MarkThreadReadParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads/${threadId}/read`, {
    messageId,
  });

  return data;
};

export const useMarkThreadRead = (
  options: MutationOptions<
    Awaited<ReturnType<typeof MarkThreadRead>>,
    Omit<MarkThreadReadParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    MarkThreadReadParams,
    Awaited<ReturnType<typeof MarkThreadRead>>
  >(MarkThreadRead, options);
};
