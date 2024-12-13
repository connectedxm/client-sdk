import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY = (
  eventId: string,
  passtypeId: string
): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENT",
  eventId,
  "PASS_TYPE",
  passtypeId,
  "ADD_ONS",
];

export const SET_SELF_EVENT_PASS_TYPE_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventPassTypeAddOns>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventPassTypeAddOnsProps extends SingleQueryParams {
  eventId: string;
  passTypeId: string;
}

export const GetSelfEventPassTypeAddOns = async ({
  eventId,
  passTypeId,
  clientApiParams,
}: GetSelfEventPassTypeAddOnsProps): Promise<
  ConnectedXMResponse<EventAddOn[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/passTypes/${passTypeId}/addOns`,
    {}
  );

  return data;
};

export const useGetSelfEventPassTypeAddOns = (
  eventId: string,
  passTypeId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventPassTypeAddOns>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventPassTypeAddOns>>(
    SELF_EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY(eventId, passTypeId),
    (params: SingleQueryParams) =>
      GetSelfEventPassTypeAddOns({
        eventId,
        passTypeId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passTypeId &&
        (options?.enabled ?? true),
    }
  );
};
