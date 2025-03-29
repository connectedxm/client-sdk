import { Thread, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { SET_THREAD_QUERY_DATA, DIRECT_THREADS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

interface StartDirectThread {}

export interface StartDirectThreadParams extends MutationParams {
  accountId: string;
}

export const StartDirectThread = async ({
  accountId,
  clientApiParams,
  queryClient,
}: StartDirectThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Thread>>(
    `/accounts/${accountId}/thread`
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: DIRECT_THREADS_QUERY_KEY(),
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
