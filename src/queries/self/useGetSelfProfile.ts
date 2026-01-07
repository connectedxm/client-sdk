import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Self } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_PROFILE_QUERY_KEY = (ignoreExecuteAs?: boolean): QueryKey => {
  const keys = ["SELF_PROFILE"];
  if (ignoreExecuteAs) keys.push("IGNORE_EXECUTEAS");
  return keys;
};

export const SET_SELF_PROFILE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_PROFILE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfProfile>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_PROFILE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfProfileProps extends SingleQueryParams {
  ignoreExecuteAs?: boolean;
}

export const GetSelfProfile = async ({
  ignoreExecuteAs,
  clientApiParams,
}: GetSelfProfileProps): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI({
    ...clientApiParams,
    getExecuteAs: ignoreExecuteAs ? undefined : clientApiParams.getExecuteAs,
  });

  const { data } = await clientApi.get(`/self/profile`);

  return data;
};

export const useGetSelfProfile = (
  ignoreExecuteAs?: boolean,
  options: SingleQueryOptions<ReturnType<typeof GetSelfProfile>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfProfile>>(
    SELF_PROFILE_QUERY_KEY(ignoreExecuteAs),
    (params: SingleQueryParams) =>
      GetSelfProfile({ ignoreExecuteAs, ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
