import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { IntegrationDetails, IntegrationType } from "@interfaces";
import { QueryClient, SetDataOptions, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { INTEGRATION_QUERY_KEY } from "./useGetIntegration";

interface IntegrationAuth {
  token: string;
  expiration?: string;
  details: IntegrationDetails;
}

export const INTEGRATION_AUTH_QUERY_KEY = (
  integrationType: keyof typeof IntegrationType
): QueryKey => ["INTEGRATION", integrationType, "AUTH"];

export const SET_INTEGRATION_AUTH_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEGRATION_AUTH_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetIntegrationAuth>>,
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

export interface GetIntegrationAuthProps extends SingleQueryParams {
  integrationType: keyof typeof IntegrationType;
}

export const GetIntegrationAuth = async ({
  integrationType,
  clientApiParams,
}: GetIntegrationAuthProps): Promise<ConnectedXMResponse<IntegrationAuth>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/integrations/${integrationType}/auth`);
  return data;
};

export const useGetIntegrationAuth = (
  integrationType: keyof typeof IntegrationType,
  expiration?: string,
  options: SingleQueryOptions<ReturnType<typeof GetIntegrationAuth>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetIntegrationAuth>>(
    INTEGRATION_QUERY_KEY(integrationType),
    (params) => GetIntegrationAuth({ integrationType, ...params }),
    {
      ...options,
      enabled:
        !!integrationType &&
        (!expiration || new Date(expiration) < new Date()) &&
        (options?.enabled ?? true),
    }
  );
};
