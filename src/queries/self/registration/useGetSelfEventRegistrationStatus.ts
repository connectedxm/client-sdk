import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_STATUS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_QUERY_KEY(), "EVENT_REGISTRATION_STATUS", eventId];

export const SET_SELF_EVENT_REGISTRATION_STATUS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_STATUS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationStatus>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_STATUS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationStatusProps extends SingleQueryParams {
  eventId: string;
}

export interface RegistrationStatusDetails {
  purchases: {
    paid: number;
    unpaid: number;
  };
}

export const GetSelfEventRegistrationStatus = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationStatusProps): Promise<
  ConnectedXMResponse<RegistrationStatusDetails>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/status`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationStatus = (
  eventId: string,
  selfId?: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationStatus>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationStatus>
  >(
    SELF_EVENT_REGISTRATION_STATUS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationStatus({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated && !!eventId && !!selfId && (options?.enabled ?? true),
    }
  );
};
