import { Activity, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import {
  UpdateLikesInfinite,
  UpdateLikesSingle,
} from "./optimistic/UpdateLikes";
import {
  ACTIVITIES_QUERY_KEY,
  ACTIVITY_QUERY_KEY,
  GetBaseSingleQueryKeys,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UnlikeActivityParams extends MutationParams {
  activityId: string;
}

export const UnlikeActivity = async ({
  activityId,
  clientApiParams,
  queryClient,
}: UnlikeActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    UpdateLikesSingle(false, queryClient, [
      ...ACTIVITY_QUERY_KEY(activityId),
      ...GetBaseSingleQueryKeys(clientApiParams.locale),
    ]);
    UpdateLikesInfinite(false, queryClient, ACTIVITIES_QUERY_KEY(), activityId);
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/likes`
  );

  return data;
};

export const useUnlikeActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnlikeActivity>>,
      Omit<UnlikeActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnlikeActivityParams,
    Awaited<ReturnType<typeof UnlikeActivity>>
  >(UnlikeActivity, options);
};
