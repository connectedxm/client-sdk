import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_EVENT_REGISTRATION_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_QUERY_KEY(), "EVENT_REGISTRATION", eventId];

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
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistration = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventRegistration>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventRegistration>>(
    SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistration({
        eventId,
        ...params,
      }),
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
