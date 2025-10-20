import {
  ACTIVITIES_QUERY_KEY,
  ACTIVITY_COMMENTS_QUERY_KEY,
  ACTIVITY_QUERY_KEY,
  GROUP_ACTIVITIES_QUERY_KEY,
  EVENT_ACTIVITIES_QUERY_KEY,
  GetBaseSingleQueryKeys,
} from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ActivityEntityInput } from "./useCreateActivity";

interface ActivityUpdateParams {
  message: string;
  entities: ActivityEntityInput[];
  imageId?: string;
  videoId?: string;
  pinned?: boolean;
}

export interface UpdateActivityParams extends MutationParams {
  activityId: string;
  activity: ActivityUpdateParams;
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
    // Update the single activity query
    queryClient.setQueryData(
      [
        ...ACTIVITY_QUERY_KEY(activityId),
        ...GetBaseSingleQueryKeys(clientApiParams.locale),
      ],
      data.data
    );

    // Invalidate related queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });

    // If the activity has relationships, invalidate those queries too
    if (data.data.eventId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ACTIVITIES_QUERY_KEY(data.data.eventId),
      });
    }

    if (data.data.groupId) {
      queryClient.invalidateQueries({
        queryKey: GROUP_ACTIVITIES_QUERY_KEY(data.data.groupId),
      });
    }

    if (data.data.commentedId) {
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_COMMENTS_QUERY_KEY(data.data.commentedId),
      });
    }
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
