import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  PaymentIntent,
  RegistrationDraft,
} from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_REGISTRATION_QUERY_KEY } from "./useGetEventRegistration";

export const EVENT_REGISTRATION_INTENT_QUERY_KEY = (
  eventId: string,
  draftHash: string,
  addressId?: string,
  split?: boolean
) => {
  const key = [...EVENT_REGISTRATION_QUERY_KEY(eventId), "INTENT", draftHash];
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
  draft: RegistrationDraft;
  addressId: string;
  split: boolean;
}

export const GetEventRegistrationIntent = async ({
  eventId,
  draft,
  addressId,
  split,
  clientApiParams,
}: GetEventRegistrationIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/events/${eventId}/registration/intent`,
    {
      draft,
      addressId,
      split: split ? "true" : "false",
    }
  );
  return data;
};

export const useGetEventRegistrationIntent = (
  eventId: string = "",
  draft: RegistrationDraft,
  draftHash: string,
  addressId: string = "",
  split: boolean = false,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationIntent>>(
    EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId, draftHash, addressId, split),
    (params) =>
      GetEventRegistrationIntent({
        eventId,
        draft,
        addressId,
        split,
        ...params,
      }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
