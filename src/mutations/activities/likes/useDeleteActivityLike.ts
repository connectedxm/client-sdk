import { Activity, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "@src/mutations/useConnectedMutation";
import {
  UpdateLikesInfinite,
  UpdateLikesSingle,
} from "../optimistic/UpdateLikes";
import {
  ACTIVITIES_QUERY_KEY,
  ACTIVITY_QUERY_KEY,
  GetBaseSingleQueryKeys,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Activities
 */
export interface DeleteActivityLikeParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const DeleteActivityLike = async ({
  activityId,
  clientApiParams,
  queryClient,
}: DeleteActivityLikeParams): Promise<ConnectedXMResponse<Activity>> => {
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

/**
 * @category Mutations
 * @group Activities
 */
export const useDeleteActivityLike = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteActivityLike>>,
      Omit<DeleteActivityLikeParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteActivityLikeParams,
    Awaited<ReturnType<typeof DeleteActivityLike>>
  >(DeleteActivityLike, options);
};
