import { BasePassType, ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

interface PassTypeWithAddOns extends BasePassType {
  addOns: EventAddOn[];
}

export const EVENT_REGISTRATION_ADD_ONS_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_REGISTRATION_QUERY_KEY(eventId), "ADD_ONS"];

export const SET_EVENT_REGISTRATION_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationAddOns>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_REGISTRATION_ADD_ONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventRegistrationAddOnsProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventRegistrationAddOns = async ({
  eventId,
  clientApiParams,
}: GetEventRegistrationAddOnsProps): Promise<
  ConnectedXMResponse<PassTypeWithAddOns[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/addOns`,
    {}
  );

  return data;
};

export const useGetEventRegistrationAddOns = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationAddOns>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationAddOns>>(
    EVENT_REGISTRATION_ADD_ONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventRegistrationAddOns({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
