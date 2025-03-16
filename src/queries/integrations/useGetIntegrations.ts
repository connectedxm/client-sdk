import type { Integration } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const INTEGRATIONS_QUERY_KEY = (): QueryKey => {
  const keys = ["INTEGRATIONS"];
  return keys;
};

export interface GetIntegrationsProps extends InfiniteQueryParams {}

export const GetIntegrations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
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
