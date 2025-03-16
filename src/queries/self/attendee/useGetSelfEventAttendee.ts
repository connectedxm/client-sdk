import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_ATTENDEE_QUERY_KEY = (eventId: string): QueryKey => [
  ...SELF_QUERY_KEY(),
  "ATTENDEE",
  eventId,
];

export interface GetSelfEventAttendeeProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventAttendee = async ({
  eventId,
  clientApiParams,
}: GetSelfEventAttendeeProps): Promise<ConnectedXMResponse<Registration>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/attendee`);

  return data;
};

export const useGetSelfEventAttendee = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventAttendee>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventAttendee>>(
    SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendee({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
