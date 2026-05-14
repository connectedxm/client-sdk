import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "../../../useGetEvent";
import { ConnectedXMResponse, EventActivation } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => {
  const key = [...EVENT_QUERY_KEY(eventId), "ACTIVATIONS", passId];
  return key;
};

export const SET_EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePassActivations>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventAttendeePassActivationsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventAttendeePassActivations = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventAttendeePassActivationsProps): Promise<
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

export const useGetEventAttendeePassActivations = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeePassActivations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeePassActivations>>
  >(
    EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeePassActivations({ eventId, passId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
