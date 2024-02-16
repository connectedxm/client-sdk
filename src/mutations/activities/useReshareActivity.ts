import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as ACTIVITIES } from "@context/queries/activities/useGetActivities";
import { QUERY_KEY as ACTIVITY } from "@context/queries/activities/useGetActivity";
import {
  UpdateResharesInfinite,
  UpdateResharesSingle,
} from "@context/utilities/optimistic/UpdateReshares";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface ReshareActivityParams extends MutationParams {
  activityId: string;
  message?: string;
}

export const ReshareActivity = async ({
  activityId,
  message,
}: ReshareActivityParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/self/activities/${activityId}/reshares`,
    {
      // Just doing an empty string right now because an activity has to have some message
      message: message || "",
    }
  );
  return data;
};

export const useReshareActivity = (activityId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<ReshareActivityParams>(ReshareActivity, {
    onMutate: () => {
      // Optimistic mutation for single query
      UpdateResharesSingle(true, queryClient, [ACTIVITY, activityId]);
      UpdateResharesInfinite(true, queryClient, [ACTIVITIES], activityId);
    },
  });
};

export default useReshareActivity;
