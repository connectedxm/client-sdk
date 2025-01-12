import type { EventActivationCompletion } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_ACTIVATION_QUERY_KEY } from "./useGetEventActivation";

export const EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY = (
  eventId: string,
  activationId: string
): QueryKey => [
  ...EVENT_ACTIVATION_QUERY_KEY(eventId, activationId),
  "COMPLETIONS",
];

export const SET_EVENT_ACTIVATION_COMPLETIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivationCompletions>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventActivationCompletionsProps
  extends InfiniteQueryParams {
  eventId: string;
  activationId: string;
}

export const GetEventActivationCompletions = async ({
  eventId,
  activationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventActivationCompletionsProps): Promise<
  ConnectedXMResponse<EventActivationCompletion[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/${activationId}/completions`,
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

export const useGetEventActivationCompletions = (
  eventId: string = "",
  activationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivationCompletions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivationCompletions>>
  >(
    EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
    (params: InfiniteQueryParams) =>
      GetEventActivationCompletions({ eventId, activationId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!activationId && (options?.enabled ?? true),
    }
  );
};
