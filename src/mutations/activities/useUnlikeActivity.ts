import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as ACTIVITIES } from "@context/queries/activities/useGetActivities";
import { QUERY_KEY as ACTIVITY } from "@context/queries/activities/useGetActivity";
import {
  UpdateLikesInfinite,
  UpdateLikesSingle,
} from "@context/utilities/optimistic/UpdateLikes";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UnlikeActivityParams extends MutationParams {
  activityId: string;
}

export const UnlikeActivity = async ({ activityId }: UnlikeActivityParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/self/activities/${activityId}/likes`
  );
  return data;
};

export const useUnlikeActivity = (activityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UnlikeActivityParams>(
    (params: MutationParams) => UnlikeActivity({ ...params, activityId }),
    {
      onMutate: () => {
        // Optimistic mutation for single query
        UpdateLikesSingle(false, queryClient, [ACTIVITY, activityId]);
        UpdateLikesInfinite(false, queryClient, [ACTIVITIES], activityId);
      },
    },
    undefined,
    true
  );
};

export default useUnlikeActivity;
