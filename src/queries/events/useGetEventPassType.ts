import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, PassType } from "@interfaces";
import { EVENT_PASS_TYPES_QUERY_KEY } from "./useGetEventPassTypes";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_PASS_TYPE_QUERY_KEY = (
  eventId: string,
  passTypeId: string
): QueryKey => [...EVENT_PASS_TYPES_QUERY_KEY(eventId), passTypeId];

export const SET_EVENT_PASS_TYPE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassType>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_TYPE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassTypeProps extends SingleQueryParams {
  eventId: string;
  passTypeId: string;
}

export const GetEventPassType = async ({
  eventId,
  passTypeId,
  clientApiParams,
}: GetEventPassTypeProps): Promise<ConnectedXMResponse<PassType>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/passTypes/${passTypeId}`
  );
  return data;
};

export const useGetEventPassType = (
  eventId: string = "",
  passTypeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPassType>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPassType>>(
    EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId),
    (params) => GetEventPassType({ eventId, passTypeId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!passTypeId && (options?.enabled ?? true),
    }
  );
};
