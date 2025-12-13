import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../../self/useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const EVENT_REGISTRATION_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_QUERY_KEY(), "EVENTS", "REGISTRATION", eventId];

export const SET_EVENT_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_REGISTRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventRegistrationProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventRegistration = async ({
  eventId,
  clientApiParams,
}: GetEventRegistrationProps): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/registration`);

  return data;
};

export const useGetEventRegistration = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventRegistration>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistration>>(
    EVENT_REGISTRATION_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventRegistration({
        eventId,
        ...params,
      }),
    {
      ...options,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
