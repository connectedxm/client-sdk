import { ACTIVITIES_QUERY_KEY, ACTIVITY_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import {
  UpdateResharesInfinite,
  UpdateResharesSingle,
} from "./optimistic/UpdateReshares";
import { Activity, ConnectedXMResponse } from "@src/interfaces";

export interface ReshareActivityParams extends MutationParams {
  activityId: string;
}

export const ReshareActivity = async ({
  activityId,
  queryClient,
  clientApi,
}: ReshareActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    UpdateResharesSingle(true, queryClient, ACTIVITY_QUERY_KEY(activityId));
    UpdateResharesInfinite(
      true,
      queryClient,
      ACTIVITIES_QUERY_KEY(),
      activityId
    );
  }

  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/self/activities/${activityId}/reshares`,
    {
      message: "",
    }
  );
  return data;
};

export const useReshareActivity = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof ReshareActivity>>,
    ReshareActivityParams
  > = {}
) => {
  return useConnectedMutation<
    ReshareActivityParams,
    Awaited<ReturnType<typeof ReshareActivity>>
  >(ReshareActivity, params, options);
};
