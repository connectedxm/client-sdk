import { Thread, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { SET_THREAD_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

interface UpdateThread {
  subject?: string;
  imageId?: string;
}

export interface UpdateThreadParams extends MutationParams {
  threadId: string;
  thread: UpdateThread;
}

export const UpdateThread = async ({
  threadId,
  thread,
  clientApiParams,
  queryClient,
}: UpdateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Thread>>(
    `/threads/${threadId}`,
    thread
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_QUERY_DATA(queryClient, [data.data.id], data);
  }

  return data;
};

export const useUpdateThread = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateThread>>,
      Omit<UpdateThreadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadParams,
    Awaited<ReturnType<typeof UpdateThread>>
  >(UpdateThread, options);
};
