import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_INTENT_QUERY_KEY = (
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

export interface GetSelfEventAttendeePassAddOnsIntentProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  addOnIds: string[];
  addressId: string;
}

export const GetSelfEventAttendeePassAddOnsIntent = async ({
  eventId,
  passId,
  addOnIds,
  addressId,
  clientApiParams,
}: GetSelfEventAttendeePassAddOnsIntentProps): Promise<
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

export const useGetSelfEventAttendeePassAddOnsIntent = (
  eventId: string,
  passId: string,
  addressId: string,
  addOnIds: string[],
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePassAddOnsIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePassAddOnsIntent>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_INTENT_QUERY_KEY(
      eventId,
      passId,
      addressId,
      addOnIds
    ),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePassAddOnsIntent({
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
