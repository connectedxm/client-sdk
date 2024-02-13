import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Self } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks";

export const SELF_QUERY_KEY = () => ["SELF"];

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

interface GetSelfProps extends SingleQueryParams {}

export const GetSelf = async ({
  clientApi,
}: GetSelfProps): Promise<ConnectedXMResponse<Self>> => {
  const { data } = await clientApi.get(`/self`);
  return data;
};

const useGetSelf = (
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetSelf>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelf>>(
    SELF_QUERY_KEY(),
    (params: SingleQueryParams) => GetSelf({ ...params }),
    params,
    {
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetSelf;
