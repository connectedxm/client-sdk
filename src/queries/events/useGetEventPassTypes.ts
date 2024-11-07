import type { ConnectedXMResponse, Ticket } from "@interfaces";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const EVENT_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  passTypeId: string = ""
): QueryKey => [...EVENT_QUERY_KEY(eventId), "PASS_TYPES", passTypeId];

export const SET_EVENT_PASS_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypes>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_TYPES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassTypesProps extends SingleQueryParams {
  eventId: string;
  passTypeId?: string;
}

export const GetEventPassTypes = async ({
  eventId,
  passTypeId,
  clientApiParams,
}: GetEventPassTypesProps): Promise<ConnectedXMResponse<Ticket[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/tickets`, {
    params: {
      ticketId: passTypeId || undefined,
    },
  });
  return data;
};

export const useGetEventPassTypes = (
  eventId: string = "",
  passTypeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPassTypes>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPassTypes>>(
    EVENT_PASS_TYPES_QUERY_KEY(eventId),
    (params) => GetEventPassTypes({ eventId, passTypeId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
