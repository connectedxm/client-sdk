import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { EVENT_REGISTRATION_QUERY_KEY } from "./useGetEventRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const EVENT_REGISTRATION_INTENT_QUERY_KEY = (
  eventId: string,
  addressId?: string,
  split?: boolean
) => {
  const key = [...EVENT_REGISTRATION_QUERY_KEY(eventId), "INTENT"];
  if (addressId) {
    key.push(addressId);
  }
  if (split) {
    key.push("SPLIT");
  }
  return key;
};

export interface GetEventRegistrationIntentProps extends SingleQueryParams {
  eventId: string;
  addressId: string;
  split: boolean;
}

export const GetEventRegistrationIntent = async ({
  eventId,
  addressId,
  split,
  clientApiParams,
}: GetEventRegistrationIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/intent`,
    {
      params: {
        addressId,
        split: split ? "true" : "false",
      },
    }
  );
  return data;
};

export const useGetEventRegistrationIntent = (
  eventId: string = "",
  addressId: string = "",
  split: boolean = false,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationIntent>>(
    EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId, addressId, split),
    (params) =>
      GetEventRegistrationIntent({ eventId, addressId, split, ...params }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!addressId &&
        (options?.enabled ?? true),
    }
  );
};
