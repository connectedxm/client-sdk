import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ThreadCircle } from "@src/interfaces";
import { SET_THREAD_CIRCLE_QUERY_DATA } from "@src/queries/threads/useGetThreadCircle";
import { ThreadCircleUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadCircleParams extends MutationParams {
  circleId: string;
  circle: ThreadCircleUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadCircle = async ({
  circleId,
  circle,
  clientApiParams,
  queryClient,
}: UpdateThreadCircleParams): Promise<ConnectedXMResponse<ThreadCircle>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put(`/threads/circles/${circleId}`, circle);

  if (queryClient && data.status === "ok") {
    SET_THREAD_CIRCLE_QUERY_DATA(queryClient, [circleId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
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
