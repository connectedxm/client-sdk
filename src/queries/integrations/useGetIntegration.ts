import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { Integration } from "@interfaces";
import { INTEGRATIONS_QUERY_KEY } from "./useGetIntegrations";
import { QueryClient, SetDataOptions, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const INTEGRATION_QUERY_KEY = (integrationId: string): QueryKey => [
  ...INTEGRATIONS_QUERY_KEY(),
  integrationId,
];

export const SET_INTEGRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEGRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetIntegration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...INTEGRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetIntegrationProps extends SingleQueryParams {
  integrationId: string;
}

export const GetIntegration = async ({
  integrationId,
  clientApiParams,
}: GetIntegrationProps): Promise<ConnectedXMResponse<Integration>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/integrations/${integrationId}`);
  return data;
};

export const useGetIntegration = (
  integrationId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetIntegration>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetIntegration>>(
    INTEGRATION_QUERY_KEY(integrationId),
    (params) => GetIntegration({ integrationId, ...params }),
    {
      ...options,
      enabled: !!integrationId && (options?.enabled ?? true),
    }
  );
};
