import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ACTIVITIES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Activities
 */
export interface DeleteActivityParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const DeleteActivity = async ({
  activityId,
  clientApiParams,
  queryClient,
}: DeleteActivityParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/activities/${activityId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
  }

  return data;
};

/**
 * @category Mutations
 * @group Activities
 */
export const useDeleteActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteActivity>>,
      Omit<DeleteActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteActivityParams,
    Awaited<ReturnType<typeof DeleteActivity>>
  >(DeleteActivity, options);
};
