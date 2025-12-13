import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const EVENT_PASS_ADD_ONS_INTENT_QUERY_KEY = (
  eventId: string,
  passId: string,
  addressId: string,
  addOnIds: string[]
): QueryKey => {
  const key = [
    ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    passId,
    "ADD_ONS_INTENT",
  ];

  if (addOnIds) {
    key.push(...addOnIds);
  }

  key.push(addressId);

  return key;
};

export interface GetEventPassAddOnsIntentProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  addOnIds: string[];
  addressId: string;
}

export const GetEventPassAddOnsIntent = async ({
  eventId,
  passId,
  addOnIds,
  addressId,
  clientApiParams,
}: GetEventPassAddOnsIntentProps): Promise<
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

export const useGetEventPassAddOnsIntent = (
  eventId: string,
  passId: string,
  addressId: string,
  addOnIds: string[],
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassAddOnsIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassAddOnsIntent>
  >(
    EVENT_PASS_ADD_ONS_INTENT_QUERY_KEY(
      eventId,
      passId,
      addressId,
      addOnIds
    ),
    (params: SingleQueryParams) =>
      GetEventPassAddOnsIntent({
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
        !!addressId &&
        !!addOnIds &&
        (options?.enabled ?? true),
    }
  );
};
