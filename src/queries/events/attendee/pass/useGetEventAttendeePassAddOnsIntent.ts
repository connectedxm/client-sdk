import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";

export const EVENT_ATTENDEE_PASS_ADD_ONS_INTENT_QUERY_KEY = (
  eventId: string,
  passId: string,
  addressId: string,
  addOnIds: string[]
): QueryKey => {
  const key = [
    ...EVENT_ATTENDEE_QUERY_KEY(eventId),
    passId,
    "ADD_ONS_INTENT",
  ];

  if (addOnIds) {
    key.push(...addOnIds);
  }

  key.push(addressId);

  return key;
};

export interface GetEventAttendeePassAddOnsIntentProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  addOnIds: string[];
  addressId: string;
}

export const GetEventAttendeePassAddOnsIntent = async ({
  eventId,
  passId,
  addOnIds,
  addressId,
  clientApiParams,
}: GetEventAttendeePassAddOnsIntentProps): Promise<
  ConnectedXMResponse<PaymentIntent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/addOns/intent`,
    {
      params: {
        addOnIds: addOnIds ? addOnIds.join(",") : "",
        addressId,
      },
    }
  );

  return data;
};

export const useGetEventAttendeePassAddOnsIntent = (
  eventId: string = "",
  passId: string = "",
  addressId: string = "",
  addOnIds: string[],
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassAddOnsIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassAddOnsIntent>
  >(
    EVENT_ATTENDEE_PASS_ADD_ONS_INTENT_QUERY_KEY(
      eventId,
      passId,
      addressId,
      addOnIds
    ),
    (params: SingleQueryParams) =>
      GetEventAttendeePassAddOnsIntent({
        eventId,
        passId,
        addressId,
        addOnIds,
        ...params,
      }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passId &&
        !!addOnIds &&
        (options?.enabled ?? true),
    }
  );
};
