import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SET_ACTIVITY_QUERY_DATA, ACTIVITIES_QUERY_KEY } from "@src/queries";

export interface ReportActivityParams extends MutationParams {
  activityId: string;
}

export const ReportActivity = async ({
  activityId,
  queryClient,
  clientApiParams,
}: ReportActivityParams): Promise<ConnectedXMResponse<Activity>> => {
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

export const useReportActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ReportActivity>>,
      Omit<ReportActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReportActivityParams,
    Awaited<ReturnType<typeof ReportActivity>>
  >(ReportActivity, options);
};
