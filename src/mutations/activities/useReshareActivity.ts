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
import { GetClientAPI } from "@src/ClientAPI";

export interface ReshareActivityParams extends MutationParams {
  activityId: string;
}

export const ReshareActivity = async ({
  activityId,
  queryClient,
  clientApiParams,
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

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/self/activities/${activityId}/reshares`,
    {
      message: "",
    }
  );
  return data;
};

export const useReshareActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ReshareActivity>>,
      Omit<ReshareActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReshareActivityParams,
    Awaited<ReturnType<typeof ReshareActivity>>
  >(ReshareActivity, options);
};
