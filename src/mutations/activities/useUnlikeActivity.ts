import { Activity, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import {
  UpdateLikesInfinite,
  UpdateLikesSingle,
} from "./optimistic/UpdateLikes";
import { ACTIVITIES_QUERY_KEY, ACTIVITY_QUERY_KEY } from "@src/queries";

export interface UnlikeActivityParams extends MutationParams {
  activityId: string;
}

export const UnlikeActivity = async ({
  activityId,
  clientApi,
  queryClient,
}: UnlikeActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    UpdateLikesSingle(false, queryClient, ACTIVITY_QUERY_KEY(activityId));
    UpdateLikesInfinite(false, queryClient, ACTIVITIES_QUERY_KEY(), activityId);
  }

  const { data } = await clientApi.delete<ConnectedXMResponse<Activity>>(
    `/self/activities/${activityId}/likes`
  );

  return data;
};

export const useUnlikeActivity = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnlikeActivity>>,
      Omit<UnlikeActivityParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnlikeActivityParams,
    Awaited<ReturnType<typeof UnlikeActivity>>
  >(UnlikeActivity, params, options);
};
