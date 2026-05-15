import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Thread } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";

export interface StartDirectThreadParams extends MutationParams {
  accountId: string;
  subject?: string;
  imageId?: string;
}

export const StartDirectThread = async ({
  accountId,
  subject,
  imageId,
  clientApiParams,
  queryClient,
}: StartDirectThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads`, {
    accountIds: [accountId],
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

export const useStartDirectThread = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof StartDirectThread>>,
      Omit<StartDirectThreadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    StartDirectThreadParams,
    Awaited<ReturnType<typeof StartDirectThread>>
  >(StartDirectThread, options);
};
