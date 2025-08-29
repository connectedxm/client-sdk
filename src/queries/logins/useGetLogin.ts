import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Login } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const LOGIN_QUERY_KEY = (): QueryKey => {
  const keys = ["LOGIN"];
  return keys;
};

export const SET_LOGINS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LOGIN_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLogin>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...LOGIN_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

export interface GetLoginProps extends SingleQueryParams {}

export const GetLogin = async ({
  clientApiParams,
}: GetLoginProps): Promise<ConnectedXMResponse<Login>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/login`);
  return data;
};

export const useGetLogin = (
  options: SingleQueryOptions<ReturnType<typeof GetLogin>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLogin>>(
    LOGIN_QUERY_KEY(),
    (params: SingleQueryParams) => GetLogin(params),
    {
      ...options,
    }
  );
};
