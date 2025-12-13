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
export interface CreateActivityLikeParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const CreateActivityLike = async ({
  activityId,
  clientApiParams,
  queryClient,
}: CreateActivityLikeParams): Promise<ConnectedXMResponse<Activity>> => {
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

/**
 * @category Mutations
 * @group Activities
 */
export const useCreateActivityLike = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateActivityLike>>,
      Omit<CreateActivityLikeParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateActivityLikeParams,
    Awaited<ReturnType<typeof CreateActivityLike>>
  >(CreateActivityLike, options);
};
