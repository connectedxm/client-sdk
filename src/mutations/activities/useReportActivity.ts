import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ActivityReport, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface ReportActivityParams extends MutationParams {
  activityId: string;
}

export const ReportActivity = async ({
  activityId,
  clientApiParams,
}: ReportActivityParams): Promise<ConnectedXMResponse<ActivityReport>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ActivityReport>>(
    `/activities/${activityId}/report`
  );

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
