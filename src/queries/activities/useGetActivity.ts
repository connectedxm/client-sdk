import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { ACTIVITIES_QUERY_KEY } from "./useGetActivities";
import { QueryKey } from "@tanstack/react-query";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACTIVITY_QUERY_KEY = (activityId: string): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  activityId,
];

export interface GetActivityProps extends SingleQueryParams {
  activityId: string;
}

export const GetActivity = async ({
  activityId,
  clientApiParams,
}: GetActivityProps): Promise<ConnectedXMResponse<Activity>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/activities/${activityId}`);
  return data;
};

export const useGetActivity = (
  activityId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetActivity>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivity>>(
    ACTIVITY_QUERY_KEY(activityId),
    (params: SingleQueryParams) =>
      GetActivity({ activityId: activityId || "unknown", ...params }),
    {
      ...options,
      enabled: !!activityId && (options?.enabled ?? true),
    }
  );
};
