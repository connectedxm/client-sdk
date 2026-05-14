import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, RegistrationDraft } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_QUERY_KEY } from "./useGetEvent";

export const EVENT_REGISTRATION_QUERY_KEY = (eventId: string) => {
  const key = [...EVENT_QUERY_KEY(eventId), "REGISTRATION"];
  return key;
};

export interface GetEventRegistrationProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventRegistration = async ({
  eventId,
  clientApiParams,
}: GetEventRegistrationProps): Promise<
  Awaited<ConnectedXMResponse<RegistrationDraft>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/registration`, {});
  return data;
};

export const useGetEventRegistration = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventRegistration>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistration>>(
    EVENT_REGISTRATION_QUERY_KEY(eventId),
    (params) =>
      GetEventRegistration({
        eventId,
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
