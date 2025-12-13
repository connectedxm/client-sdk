import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

export const EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_REGISTRATION_QUERY_KEY(eventId), "ROOM_TYPES"];

export const SET_EVENT_REGISTRATION_ROOM_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationRoomTypes>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventRegistrationRoomTypesProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventRegistrationRoomTypes = async ({
  eventId,
  clientApiParams,
}: GetEventRegistrationRoomTypesProps): Promise<
  ConnectedXMResponse<EventRoomType[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/roomTypes`,
    {}
  );

  return data;
};

export const useGetEventRegistrationRoomTypes = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationRoomTypes>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventRegistrationRoomTypes>
  >(
    EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventRegistrationRoomTypes({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
