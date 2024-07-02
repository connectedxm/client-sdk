import {
  Thread,
  ThreadAccessLevel,
  ConnectedXMResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import {
  THREADS_QUERY_KEY,
  SET_THREAD_QUERY_DATA,
  ADD_SELF_RELATIONSHIP,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

interface CreateThread {
  name: string;
  description?: string;
  imageId?: string;
  eventId?: string;
  groupId?: string;
  featured?: boolean;
  access: keyof typeof ThreadAccessLevel;
}

export interface CreateThreadParams extends MutationParams {
  thread: CreateThread;
  accountIds: string[];
  firstMessage: string;
}

export const CreateThread = async ({
  thread,
  accountIds,
  firstMessage,
  clientApiParams,
  queryClient,
}: CreateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Thread>>(
    `/threads`,
    {
      thread,
      accountIds,
      firstMessage,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: THREADS_QUERY_KEY(),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "threads",
      data.data.id,
      "moderator"
    );
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
