import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY, ACTIVITY_QUERY_KEY } from "@src/queries";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface RemoveActivityReportParams extends MutationParams {
  activityId: string;
  reportId: string;
}

export const RemoveActivityReport = async ({
  activityId,
  reportId,
  queryClient,
  clientApiParams,
}: RemoveActivityReportParams): Promise<ConnectedXMResponse<Activity>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/report/${reportId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACTIVITIES_QUERY_KEY(),
    });

    SetSingleQueryData(
      queryClient,
      ACTIVITY_QUERY_KEY(activityId),
      clientApiParams.locale,
      data.data
    );
  }

  return data;
};

export const useRemoveActivityReport = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveActivityReport>>,
      Omit<RemoveActivityReportParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveActivityReportParams,
    Awaited<ReturnType<typeof RemoveActivityReport>>
  >(RemoveActivityReport, options);
};
