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

export interface LikeActivityParams extends MutationParams {
  activityId: string;
}

export const LikeActivity = async ({
  activityId,
  clientApi,
  queryClient,
}: LikeActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    UpdateLikesSingle(true, queryClient, ACTIVITY_QUERY_KEY(activityId));
    UpdateLikesInfinite(true, queryClient, ACTIVITIES_QUERY_KEY(), activityId);
  }

  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/self/activities/${activityId}/likes`
  );

  return data;
};

export const useLikeActivity = (
  options: MutationOptions<
    Awaited<ReturnType<typeof LikeActivity>>,
    LikeActivityParams
  > = {}
) => {
  return useConnectedMutation<
    LikeActivityParams,
    Awaited<ReturnType<typeof LikeActivity>>
  >((params) => LikeActivity({ ...params }), options);
};
