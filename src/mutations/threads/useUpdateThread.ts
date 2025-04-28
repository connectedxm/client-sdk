import { Thread, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";
import { THREAD_QUERY_KEY } from "@src/queries";

interface UpdateThreadInput {
  subject?: string;
  imageId?: string;
}

export interface UpdateThreadParams extends MutationParams {
  threadId: string;
  thread: UpdateThreadInput;
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
    SetSingleQueryData(
      queryClient,
      THREAD_QUERY_KEY(data.data.id),
      clientApiParams.locale,
      data
    );
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
