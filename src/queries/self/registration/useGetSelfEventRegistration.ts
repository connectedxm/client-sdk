import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient } from "@tanstack/react-query";

import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_QUERY_KEY = (eventId: string) => [
  ...SELF_QUERY_KEY(),
  "EVENT_REGISTRATION",
  eventId,
];

export const SET_SELF_EVENT_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetSelfEventRegistrationProps extends SingleQueryParams {
  eventId: string;
  ticket?: string;
  quantity?: number;
  coupon?: string;
}

export const GetSelfEventRegistration = async ({
  eventId,
  ticket,
  quantity,
  coupon,
  clientApi,
}: GetSelfEventRegistrationProps): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.get(`/self/events/${eventId}/registration`, {
    params: {
      ticket: ticket || undefined,
      quantity: quantity || undefined,
      coupon: coupon || undefined,
    },
  });

  return data;
};

const useGetSelfEventRegistration = (
  eventId: string,
  ticket?: string,
  quantity?: number,
  coupon?: string,
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventRegistration>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventRegistration>>(
    SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistration({
        eventId,
        ticket,
        quantity,
        coupon,
        ...params,
      }),
    params,
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      ...options,
      enabled: !!token && !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfEventRegistration;
