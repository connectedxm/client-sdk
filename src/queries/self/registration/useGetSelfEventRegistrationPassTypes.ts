import type { ConnectedXMResponse, PassType } from "@interfaces";
import { EVENT_QUERY_KEY } from "../../events/useGetEvent";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";

export const SELF_EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  passTypeId: string = ""
): QueryKey => [...EVENT_QUERY_KEY(eventId), "PASS_TYPES", passTypeId];

export const SET_SELF_EVENT_REGISTRATION_PASS_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationPassTypes>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPassTypesProps
  extends SingleQueryParams {
  eventId: string;
  passTypeId?: string;
}

export const GetSelfEventRegistrationPassTypes = async ({
  eventId,
  passTypeId,
  clientApiParams,
}: GetSelfEventRegistrationPassTypesProps): Promise<
  ConnectedXMResponse<PassType[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/passTypes`, {
    params: {
      ticketId: passTypeId || undefined,
    },
  });
  return data;
};

export const useGetSelfEventRegistrationPassTypes = (
  eventId: string = "",
  passTypeId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPassTypes>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPassTypes>
  >(
    SELF_EVENT_REGISTRATION_PASS_TYPES_QUERY_KEY(eventId, passTypeId),
    (params) =>
      GetSelfEventRegistrationPassTypes({ eventId, passTypeId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
