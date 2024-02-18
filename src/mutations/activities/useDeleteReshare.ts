import { Activity, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ACTIVITIES_QUERY_KEY, ACTIVITY_QUERY_KEY } from "@src/queries";
import {
  UpdateResharesInfinite,
  UpdateResharesSingle,
} from "./optimistic/UpdateReshares";

export interface DeleteReshareParams extends MutationParams {
  activityId: string;
}

export const DeleteReshare = async ({
  activityId,
  clientApi,
  queryClient,
}: DeleteReshareParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    UpdateResharesSingle(false, queryClient, ACTIVITY_QUERY_KEY(activityId));
    UpdateResharesInfinite(
      false,
      queryClient,
      ACTIVITIES_QUERY_KEY(),
      activityId
    );
  }

  const { data } = await clientApi.delete<ConnectedXMResponse<Activity>>(
    `/self/activities/${activityId}/reshares`
  );

  return data;
};

export const useDeleteReshare = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteReshare>>,
      Omit<DeleteReshareParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteReshareParams,
    Awaited<ReturnType<typeof DeleteReshare>>
  >(DeleteReshare, params, options);
};
