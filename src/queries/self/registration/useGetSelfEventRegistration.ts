import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_QUERY_KEY = (
  eventId: string,
  registrationId?: string,
  create?: boolean
): QueryKey => {
  const key = [...SELF_QUERY_KEY(), "EVENT_REGISTRATION", eventId];
  if (registrationId) {
    key.push(registrationId);
  }
  if (create) {
    key.push("CREATE");
  }
  return key;
};

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
  create: boolean;
}

export const GetSelfEventRegistration = async ({
  eventId,
  create,
  clientApiParams,
}: GetSelfEventRegistrationProps): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/registration`, {
    params: {
      create: create ? "true" : "false",
    },
  });

  return data;
};

export const useGetSelfEventRegistration = (
  eventId: string,
  create: boolean = false,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventRegistration>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventRegistration>>(
    SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistration({
        eventId,
        create,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
