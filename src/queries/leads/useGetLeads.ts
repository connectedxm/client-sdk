import type { Lead, ConnectedXMResponse, LeadStatus } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

import { SELF_QUERY_KEY } from "../self/useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const LEADS_QUERY_KEY = (
  status?: keyof typeof LeadStatus
): QueryKey => {
  const key = [...SELF_QUERY_KEY(), "LEADS"];
  if (status) {
    key.push(status);
  }
  return key;
};

export interface GetLeadsProps extends InfiniteQueryParams {
  status?: keyof typeof LeadStatus;
}

export const GetLeads = async ({
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetLeadsProps): Promise<ConnectedXMResponse<Lead[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/leads`, {
    params: {
      status: status || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetLeads = (
  status?: keyof typeof LeadStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetLeads>>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLeads>>>(
    LEADS_QUERY_KEY(status),
    (params: InfiniteQueryParams) => GetLeads({ ...params, status }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
