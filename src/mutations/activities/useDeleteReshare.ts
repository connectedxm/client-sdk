import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as ACTIVITIES } from "@context/queries/activities/useGetActivities";
import { QUERY_KEY as ACTIVITY } from "@context/queries/activities/useGetActivity";
import {
  UpdateResharesInfinite,
  UpdateResharesSingle,
} from "@context/utilities/optimistic/UpdateReshares";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface DeleteReshareParams extends MutationParams {
  activityId: string;
}

export const DeleteReshare = async ({ activityId }: DeleteReshareParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/self/activities/${activityId}/reshares`
  );
  return data;
};

export const useDeleteReshare = (activityId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<DeleteReshareParams>(DeleteReshare, {
    onMutate: () => {
      // Optimistic mutation for single query
      UpdateResharesSingle(false, queryClient, [ACTIVITY, activityId]);
      UpdateResharesInfinite(false, queryClient, [ACTIVITIES], activityId);
    },
  });
};

export default useDeleteReshare;
