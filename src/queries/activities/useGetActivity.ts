import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { SingleActivity } from "@interfaces";
import { ACTIVITIES_QUERY_KEY } from "./useGetActivities";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACTIVITY_QUERY_KEY = (activityId: string): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  activityId,
];

export const SET_ACTIVITY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivity>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACTIVITY_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetActivityProps extends SingleQueryParams {
  activityId: string;
}

export const GetActivity = async ({
  activityId,
  clientApiParams,
}: GetActivityProps): Promise<ConnectedXMResponse<SingleActivity>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/activities/${activityId}`);
  return data;
};

export const useGetActivity = (
  activityId: string,
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
