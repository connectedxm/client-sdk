import type { Integration } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { INTEGRATION_QUERY_KEY } from "./useGetIntegration";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const INTEGRATIONS_QUERY_KEY = (): QueryKey => {
  const keys = ["INTEGRATIONS"];
  return keys;
};

export const SET_INTEGRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEGRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetIntegrations>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...INTEGRATIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetIntegrationsProps extends InfiniteQueryParams {}

export const GetIntegrations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetIntegrationsProps): Promise<ConnectedXMResponse<Integration[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/integrations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (integrationId) => INTEGRATION_QUERY_KEY(integrationId),
      locale
    );
  }

  return data;
};

export const useGetIntegrations = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetIntegrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetIntegrations>>>(
    INTEGRATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetIntegrations({ ...params }),
    params,
    options
  );
};
