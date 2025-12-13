import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import {
  QueryClient,
  SetDataOptions,
  QueryKey,
  Updater,
} from "@tanstack/react-query";
import type { ConnectedXMResponse, ThreadCircle } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { THREAD_CIRCLES_QUERY_KEY } from "./useGetThreadCircles";

export const THREAD_CIRCLE_QUERY_KEY = (circleId: string): QueryKey => [
  ...THREAD_CIRCLES_QUERY_KEY(),
  circleId,
];

export const SET_THREAD_CIRCLE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLE_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThreadCircle>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...THREAD_CIRCLE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetThreadCircleProps extends SingleQueryParams {
  circleId: string;
}

export const GetThreadCircle = async ({
  circleId,
  clientApiParams,
}: GetThreadCircleProps): Promise<ConnectedXMResponse<ThreadCircle>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/circles/${circleId}`);
  return data;
};

export const useGetThreadCircle = (
  circleId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadCircle>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadCircle>>(
    THREAD_CIRCLE_QUERY_KEY(circleId),
    (params) => GetThreadCircle({ circleId, ...params }),
    {
      ...options,
      enabled: !!circleId && (options?.enabled ?? true),
    }
  );
};
