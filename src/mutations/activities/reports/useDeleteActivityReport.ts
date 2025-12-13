import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY, SET_ACTIVITY_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Activities
 */
export interface DeleteActivityReportParams extends MutationParams {
  activityId: string;
  reportId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const DeleteActivityReport = async ({
  activityId,
  reportId,
  queryClient,
  clientApiParams,
}: DeleteActivityReportParams): Promise<ConnectedXMResponse<Activity>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/report/${reportId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACTIVITIES_QUERY_KEY(),
    });

    SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

/**
 * @category Mutations
 * @group Activities
 */
export const useDeleteActivityReport = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteActivityReport>>,
      Omit<DeleteActivityReportParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteActivityReportParams,
    Awaited<ReturnType<typeof DeleteActivityReport>>
  >(DeleteActivityReport, options);
};
