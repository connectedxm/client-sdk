import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY = (
  eventId: string,
  addressId?: string
) => {
  const key = [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), "INTENT"];
  if (addressId) {
    key.push(addressId);
  }
  return key;
};

export interface GetSelfEventRegistrationIntentProps extends SingleQueryParams {
  eventId: string;
  addressId: string;
}

export const GetSelfEventRegistrationIntent = async ({
  eventId,
  addressId,
  clientApiParams,
}: GetSelfEventRegistrationIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/intent`,
    {
      params: {
        addressId,
      },
    }
  );
  return data;
};

export const useGetSelfEventRegistrationIntent = (
  eventId: string = "",
  addressId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationIntent>
  >(
    SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId, addressId),
    (params) =>
      GetSelfEventRegistrationIntent({ eventId, addressId, ...params }),
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
