import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Self } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_QUERY_KEY = (ignoreExecuteAs?: boolean): QueryKey => {
  const keys = ["SELF"];
  if (ignoreExecuteAs) keys.push("IGNORE_EXECUTEAS");
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
  ignoreExecuteAs?: boolean;
}

export const GetSelf = async ({
  ignoreExecuteAs,
  clientApiParams,
}: GetSelfProps): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI({
    ...clientApiParams,
    getExecuteAs: ignoreExecuteAs ? undefined : clientApiParams.getExecuteAs,
  });

  const { data } = await clientApi.get(`/self`);

  return data;
};

export const useGetSelf = (
  ignoreExecuteAs?: boolean,
  options: SingleQueryOptions<ReturnType<typeof GetSelf>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelf>>(
    SELF_QUERY_KEY(ignoreExecuteAs),
    (params: SingleQueryParams) => GetSelf({ ignoreExecuteAs, ...params }),
    {
      ...options,
    }
  );
};
