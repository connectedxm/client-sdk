import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Activity } from "@interfaces";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACTIVITIES_QUERY_KEY } from "./useGetActivities";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const ACTIVITY_QUERY_KEY = (activityId: string) => [
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

interface GetActivityProps extends SingleQueryParams {
  activityId: string;
}

export const GetActivity = async ({
  activityId,
  clientApi,
}: GetActivityProps): Promise<ConnectedXMResponse<Activity>> => {
  const { data } = await clientApi.get(`/activities/${activityId}`);
  return data;
};

export const useGetActivity = (
  activityId: string,
  options: SingleQueryOptions<ReturnType<typeof GetActivity>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetActivity>>(
    ACTIVITY_QUERY_KEY(activityId),
    (params: SingleQueryParams) =>
      GetActivity({ activityId: activityId || "unknown", ...params }),
    {
      ...options,
      enabled: !!token && !!activityId && (options?.enabled ?? true),
    }
  );
};
