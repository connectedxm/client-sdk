import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY = (eventId: string) => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "INTENT",
];

export interface GetSelfEventRegistrationIntentProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventRegistrationIntent = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/intent`
  );
  return data;
};

export const useGetSelfEventRegistrationIntent = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationIntent>
  >(
    SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
    (params) => GetSelfEventRegistrationIntent({ eventId, ...params }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
