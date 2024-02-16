import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as ACTIVITIES } from "@context/queries/activities/useGetActivities";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface DeleteActivityParams extends MutationParams {
  activityId: string;
}

export const DeleteActivity = async ({ activityId }: DeleteActivityParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/self/activities/${activityId}`);
  return data;
};

export const useDeleteActivity = (activityId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<any>(() => DeleteActivity({ activityId }), {
    onSuccess: () => {
      queryClient.invalidateQueries([ACTIVITIES]);
    },
  });
};

export default useDeleteActivity;
