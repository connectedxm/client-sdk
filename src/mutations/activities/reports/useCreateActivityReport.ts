import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SET_ACTIVITY_QUERY_DATA, ACTIVITIES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Activities
 */
export interface CreateActivityReportParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const CreateActivityReport = async ({
  activityId,
  queryClient,
  clientApiParams,
}: CreateActivityReportParams): Promise<ConnectedXMResponse<Activity>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/report`
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
export const useCreateActivityReport = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateActivityReport>>,
      Omit<CreateActivityReportParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateActivityReportParams,
    Awaited<ReturnType<typeof CreateActivityReport>>
  >(CreateActivityReport, options);
};
