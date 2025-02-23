import { Thread, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { SET_THREAD_QUERY_DATA, PRIVATE_THREADS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

interface CreateThread {
  imageId?: string;
}

export interface CreateThreadParams extends MutationParams {
  thread: CreateThread;
  accountIds: string[];
  groupIds: string[];
  message: string;
}

export const CreateThread = async ({
  thread,
  accountIds,
  groupIds,
  message,
  clientApiParams,
  queryClient,
}: CreateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Thread>>(
    `/threads`,
    {
      thread,
      accountIds,
      groupIds,
      message,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: PRIVATE_THREADS_QUERY_KEY(),
    });
  }

  return data;
};

export const useCreateThread = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateThread>>,
      Omit<CreateThreadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadParams,
    Awaited<ReturnType<typeof CreateThread>>
  >(CreateThread, options);
};
