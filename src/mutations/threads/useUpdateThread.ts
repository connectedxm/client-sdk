import {
  Thread,
  ThreadAccessLevel,
  ConnectedXMResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { THREADS_QUERY_KEY, SET_THREAD_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

interface UpdateThread {
  id: string;
  name?: string;
  description?: string;
  imageId?: string;
  featured?: boolean;
  eventId?: string;
  groupId?: string;
  access?: keyof typeof ThreadAccessLevel;
}

export interface UpdateThreadParams extends MutationParams {
  threadId: string;
  thread: UpdateThread;
  imageDataUri?: string;
}

export const UpdateThread = async ({
  threadId,
  thread,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.patch<ConnectedXMResponse<Thread>>(
    `/threads/${threadId}`,
    {
      thread,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: THREADS_QUERY_KEY(),
    });
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
