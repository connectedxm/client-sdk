import { ConnectedXMResponse, EventReservationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

export const SELF_EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), "ROOM_TYPES"];

export const SET_SELF_EVENT_REGISTRATION_ROOM_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationRoomTypes>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationRoomTypesProps
  extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventRegistrationRoomTypes = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationRoomTypesProps): Promise<
  ConnectedXMResponse<EventReservationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/roomTypes`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationRoomTypes = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationRoomTypes>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationRoomTypes>
  >(
    SELF_EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationRoomTypes({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
