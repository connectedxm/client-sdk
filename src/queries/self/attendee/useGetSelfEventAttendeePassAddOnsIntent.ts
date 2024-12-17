import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_INTENT_QUERY_KEY = (
  eventId: string,
  passId: string,
  addOnIds?: string[]
): QueryKey => {
  const key = [
    ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    passId,
    "ADD_ONS_INTENT",
  ];

  if (addOnIds) {
    key.push(...addOnIds);
  }

  return key;
};

export interface GetSelfEventAttendeePassAddOnsIntentProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  addOnIds: string[];
}

export const GetSelfEventAttendeePassAddOnsIntent = async ({
  eventId,
  passId,
  addOnIds,
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
      },
    }
  );

  return data;
};

export const useGetSelfEventAttendeePassAddOnsIntent = (
  eventId: string,
  passId: string,
  addOnIds: string[],
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePassAddOnsIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePassAddOnsIntent>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_INTENT_QUERY_KEY(
      eventId,
      passId,
      addOnIds
    ),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePassAddOnsIntent({
        eventId,
        passId,
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
