import type { ConnectedXMResponse, EventPackage, PassType } from "@interfaces";
import { EVENT_QUERY_KEY } from "../../events/useGetEvent";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

export const EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  passTypeId: string = ""
): QueryKey => [...EVENT_QUERY_KEY(eventId), "PASS_TYPES", passTypeId];

export const SET_EVENT_REGISTRATION_PASS_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPassTypes>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventRegistrationPassTypesProps extends SingleQueryParams {
  eventId: string;
  passTypeId?: string;
}

export const GetEventRegistrationPassTypes = async ({
  eventId,
  passTypeId,
  clientApiParams,
}: GetEventRegistrationPassTypesProps): Promise<
  ConnectedXMResponse<{ passTypes: PassType[]; packages: EventPackage[] }>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/passTypes`, {
    params: {
      ticketId: passTypeId || undefined,
    },
  });
  return data;
};

export const useGetEventRegistrationPassTypes = (
  eventId: string = "",
  passTypeId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationPassTypes>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventRegistrationPassTypes>
  >(
    EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY(eventId, passTypeId),
    (params) =>
      GetEventRegistrationPassTypes({ eventId, passTypeId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
