import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { EVENT_REGISTRATION_QUERY_KEY } from "./useGetEventRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const EVENT_GROUP_PASSES_INTENT_QUERY_KEY = (
  eventId: string,
  ticketId: string,
  quantity: number,
  addressId: string
) => [
  ...EVENT_REGISTRATION_QUERY_KEY(eventId),
  "GROUP_PASSES_INTENT",
  ticketId,
  quantity,
  addressId,
];

export interface GetEventGroupPassesIntentProps extends SingleQueryParams {
  eventId: string;
  ticketId: string;
  quantity: number;
  addressId: string;
}

export const GetEventGroupPassesIntent = async ({
  eventId,
  ticketId,
  quantity,
  addressId,
  clientApiParams,
}: GetEventGroupPassesIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/coupons/intent`,
    {
      params: {
        ticketId,
        quantity,
        addressId,
      },
    }
  );
  return data;
};

export const useGetEventGroupPassesIntent = (
  eventId: string = "",
  ticketId: string = "",
  quantity: number = 0,
  addressId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventGroupPassesIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventGroupPassesIntent>
  >(
    EVENT_GROUP_PASSES_INTENT_QUERY_KEY(
      eventId,
      ticketId,
      quantity,
      addressId
    ),
    (params) =>
      GetEventGroupPassesIntent({
        eventId,
        ticketId,
        quantity,
        addressId,
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
        !!ticketId &&
        !!quantity &&
        (options?.enabled ?? true),
    }
  );
};
