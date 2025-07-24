import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import {
  ConnectedXMResponse,
  EventActivation,
  TicketEventAccessLevel,
} from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ACTIVATIONS_QUERY_KEY = (
  eventId: string,
  passId: string,
  accessLevel?: keyof typeof TicketEventAccessLevel
): QueryKey => {
  const key = [...EVENT_QUERY_KEY(eventId), "ACTIVATIONS", passId];
  if (accessLevel) {
    key.push(accessLevel);
  }
  return key;
};

export const SET_EVENT_ACTIVATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivations>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ACTIVATIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventActivationsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
  accessLevel?: keyof typeof TicketEventAccessLevel;
}

export const GetEventActivations = async ({
  eventId,
  passId,
  accessLevel,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventActivationsProps): Promise<
  ConnectedXMResponse<EventActivation[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/${passId}`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        accessLevel: accessLevel || undefined,
      },
    }
  );
  return data;
};

export const useGetEventActivations = (
  eventId: string = "",
  passId: string = "",
  accessLevel?: keyof typeof TicketEventAccessLevel,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivations>>
  >(
    EVENT_ACTIVATIONS_QUERY_KEY(eventId, passId, accessLevel),
    (params: InfiniteQueryParams) =>
      GetEventActivations({ eventId, passId, accessLevel, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
