import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ACTIVITIES_QUERY_KEY } from "@src/queries";

export interface DeleteActivityParams extends MutationParams {
  activityId: string;
}

export const DeleteActivity = async ({
  activityId,
  clientApi,
  queryClient,
}: DeleteActivityParams): Promise<ConnectedXMResponse<null>> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/activities/${activityId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
  }

  return data;
};

export const useDeleteActivity = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteActivity>>,
      Omit<DeleteActivityParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteActivityParams,
    Awaited<ReturnType<typeof DeleteActivity>>
  >(DeleteActivity, params, options);
};
