import { BasePassType, ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

interface PassTypeWithAddOns extends BasePassType {
  addOns: EventAddOn[];
}

export const SELF_EVENT_REGISTRATION_ADD_ONS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), "ADD_ONS"];

export const SET_SELF_EVENT_REGISTRATION_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationAddOns>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_ADD_ONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationAddOnsProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventRegistrationAddOns = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationAddOnsProps): Promise<
  ConnectedXMResponse<PassTypeWithAddOns[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/addOns`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationAddOns = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationAddOns>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationAddOns>
  >(
    SELF_EVENT_REGISTRATION_ADD_ONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationAddOns({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
