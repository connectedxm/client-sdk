import { Thread, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { DIRECT_THREADS_QUERY_KEY, THREAD_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities";

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
    SetSingleQueryData(
      queryClient,
      THREAD_QUERY_KEY(accountId),
      clientApiParams.locale,
      data.data
    );
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
