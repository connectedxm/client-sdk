import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Thread } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";

export interface CreateThreadParams extends MutationParams {
  accountIds: string[];
  subject?: string;
  imageId?: string;
}

export const CreateThread = async ({
  accountIds,
  subject,
  imageId,
  clientApiParams,
  queryClient,
}: CreateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads`, {
    accountIds,
    subject,
    imageId,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREADS_QUERY_KEY(),
    });
  }

  return data;
};

export const useCreateThread = (
  options: MutationOptions<
    Awaited<ReturnType<typeof CreateThread>>,
    Omit<CreateThreadParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadParams,
    Awaited<ReturnType<typeof CreateThread>>
  >(CreateThread, options);
};
