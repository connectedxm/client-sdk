import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_QUERY_KEY(), "REGISTRATION", eventId];

export interface GetSelfEventRegistrationProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventRegistration = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationProps): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/registration`);

  return data;
};

export const useGetSelfEventRegistration = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventRegistration>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventRegistration>>(
    SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistration({
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
