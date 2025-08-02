import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY = (
  eventId: string,
  addressId?: string,
  split?: boolean
) => {
  const key = [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), "INTENT"];
  if (addressId) {
    key.push(addressId);
  }
  if (split) {
    key.push("SPLIT");
  }
  return key;
};

export interface GetSelfEventRegistrationIntentProps extends SingleQueryParams {
  eventId: string;
  addressId: string;
  split: boolean;
}

export const GetSelfEventRegistrationIntent = async ({
  eventId,
  addressId,
  split,
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
        split: split ? "true" : "false",
      },
    }
  );
  return data;
};

export const useGetSelfEventRegistrationIntent = (
  eventId: string = "",
  addressId: string = "",
  split: boolean = false,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationIntent>
  >(
    SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId, addressId, split),
    (params) =>
      GetSelfEventRegistrationIntent({ eventId, addressId, split, ...params }),
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
