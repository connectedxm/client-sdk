import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Self } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_QUERY_KEY = (ignoreExecuteAs?: boolean): QueryKey => {
  const keys = ["SELF"];
  if (ignoreExecuteAs) keys.push("IGNORE_EXECUTEAS");
  return keys;
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
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelf>>(
    SELF_QUERY_KEY(ignoreExecuteAs),
    (params: SingleQueryParams) => GetSelf({ ignoreExecuteAs, ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
