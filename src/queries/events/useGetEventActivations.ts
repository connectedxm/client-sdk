import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse, EventActivation } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ACTIVATIONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => {
  const key = [...EVENT_QUERY_KEY(eventId), "ACTIVATIONS", passId];
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
}

export const GetEventActivations = async ({
  eventId,
  passId,
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
      },
    }
  );
  return data;
};

export const useGetEventActivations = (
  eventId: string = "",
  passId: string = "",
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
    EVENT_ACTIVATIONS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventActivations({ eventId, passId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
