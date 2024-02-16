import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as ACTIVITIES } from "@context/queries/activities/useGetActivities";
import { QUERY_KEY as ACTIVITY } from "@context/queries/activities/useGetActivity";
import {
  UpdateLikesInfinite,
  UpdateLikesSingle,
} from "@context/utilities/optimistic/UpdateLikes";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface LikeActivityParams extends MutationParams {
  activityId: string;
}

export const LikeActivity = async ({ activityId }: LikeActivityParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/self/activities/${activityId}/likes`
  );
  return data;
};

export const useLikeActivity = (activityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<LikeActivityParams>(
    (params: MutationParams) => LikeActivity({ ...params, activityId }),
    {
      onMutate: () => {
        // Optimistic mutation for single query
        UpdateLikesSingle(true, queryClient, [ACTIVITY, activityId]);
        UpdateLikesInfinite(true, queryClient, [ACTIVITIES], activityId);
      },
    },
    undefined,
    true
  );
};

export default useLikeActivity;
