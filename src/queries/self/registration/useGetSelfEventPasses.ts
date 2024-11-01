import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_PASSES_QUERY_KEY = (eventId: string): QueryKey => {
  const key = [...SELF_QUERY_KEY(), "EVENT_PASSES", eventId];
  return key;
};

export const SET_SELF_EVENT_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventPasses>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_PASSES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventPassesProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventPasses = async ({
  eventId,
  clientApiParams,
}: GetSelfEventPassesProps): Promise<ConnectedXMResponse<Purchase[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/passes`, {});

  return data;
};

export const useGetSelfEventPasses = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventPasses>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventPasses>>(
    SELF_EVENT_PASSES_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventPasses({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
