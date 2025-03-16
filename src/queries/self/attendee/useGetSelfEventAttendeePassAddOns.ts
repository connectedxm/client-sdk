import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_PASS_ADD_ONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "AVAILABLE_ADD_ONS",
];

export interface GetSelfEventAttendeePassAddOnsProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventAttendeePassAddOns = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventAttendeePassAddOnsProps): Promise<
  ConnectedXMResponse<EventAddOn[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/addOns`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeePassAddOns = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePassAddOns>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePassAddOns>
  >(
    SELF_EVENT_ATTENDEE_PASS_ADD_ONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePassAddOns({
        eventId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated && !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
