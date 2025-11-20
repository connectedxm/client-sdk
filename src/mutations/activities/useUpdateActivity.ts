import { ACTIVITIES_QUERY_KEY, SET_ACTIVITY_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ActivityEntityInput } from "./useCreateActivity";

interface UpdateActivityInput {
  message?: string;
  entities?: ActivityEntityInput[];
  imageId?: string;
  videoId?: string;
}

export interface UpdateActivityParams extends MutationParams {
  activityId: string;
  activity: UpdateActivityInput;
}

export const UpdateActivity = async ({
  activityId,
  activity,
  clientApiParams,
  queryClient,
}: UpdateActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}`,
    activity
  );

  if (queryClient && data.status === "ok") {
    SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
  }

  return data;
};

export const useUpdateActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateActivity>>,
      Omit<UpdateActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateActivityParams,
    Awaited<ReturnType<typeof UpdateActivity>>
  >(UpdateActivity, options);
};
