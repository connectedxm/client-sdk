import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { ThreadCircle } from "@src/interfaces";
import { SET_THREAD_CIRCLE_QUERY_DATA } from "@src/queries/threads/useGetThreadCircle";

export interface UpdateThreadCircleParams extends MutationParams {
  circleId: string;
  name?: string;
}

export const UpdateThreadCircle = async ({
  circleId,
  name,
  clientApiParams,
  queryClient,
}: UpdateThreadCircleParams): Promise<ConnectedXMResponse<ThreadCircle>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put(`/threads/circles/${circleId}`, {
    name,
  });

  if (queryClient && data.status === "ok") {
    SET_THREAD_CIRCLE_QUERY_DATA(queryClient, [circleId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useUpdateThreadCircle = (
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateThreadCircle>>,
    Omit<UpdateThreadCircleParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadCircleParams,
    Awaited<ReturnType<typeof UpdateThreadCircle>>
  >(UpdateThreadCircle, options);
};
