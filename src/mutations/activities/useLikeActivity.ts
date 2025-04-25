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

export interface LikeActivityParams extends MutationParams {
  activityId: string;
}

export const LikeActivity = async ({
  activityId,
  clientApiParams,
  queryClient,
}: LikeActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    UpdateLikesSingle(true, queryClient, [
      ...ACTIVITY_QUERY_KEY(activityId),
      ...GetBaseSingleQueryKeys(clientApiParams.locale),
    ]);
    UpdateLikesInfinite(true, queryClient, ACTIVITIES_QUERY_KEY(), activityId);
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/likes`
  );

  return data;
};

export const useLikeActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof LikeActivity>>,
      Omit<LikeActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    LikeActivityParams,
    Awaited<ReturnType<typeof LikeActivity>>
  >(LikeActivity, options);
};
