import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

export const SELF_EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), "ROOM_TYPES"];

export interface GetSelfEventRegistrationRoomTypesProps
  extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventRegistrationRoomTypes = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationRoomTypesProps): Promise<
  ConnectedXMResponse<EventRoomType[]>
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
