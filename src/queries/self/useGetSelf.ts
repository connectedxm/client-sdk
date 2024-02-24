import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Self } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_QUERY_KEY = (authenticated?: boolean): QueryKey => {
  const keys = ["SELF"];
  if (authenticated) keys.push("AUTHENTICATED");
  return keys;
};

export const SET_SELF_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelf>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...SELF_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

export interface GetSelfProps extends SingleQueryParams {
  authenticated?: boolean;
}

export const GetSelf = async ({
  authenticated,
  clientApiParams,
}: GetSelfProps): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI({
    ...clientApiParams,
    getExecuteAs: authenticated ? undefined : clientApiParams.getExecuteAs,
  });

  const { data } = await clientApi.get(`/self`);

  return data;
};

export const useGetSelf = (
  authenticated?: boolean,
  options: SingleQueryOptions<ReturnType<typeof GetSelf>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelf>>(
    SELF_QUERY_KEY(authenticated),
    (params: SingleQueryParams) => GetSelf({ authenticated, ...params }),
    {
      ...options,
    }
  );
};
