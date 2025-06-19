import type { Lead, ConnectedXMResponse, LeadStatus } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_LEAD_QUERY_KEY } from "./useGetSelfLead";

export const SELF_LEADS_QUERY_KEY = (
  status?: keyof typeof LeadStatus
): QueryKey => {
  const key = [...SELF_QUERY_KEY(), "LEADS"];
  if (status) {
    key.push(status);
  }
  return key;
};

export interface GetSelfLeadsProps extends InfiniteQueryParams {
  status?: keyof typeof LeadStatus;
}

export const GetSelfLeads = async ({
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetSelfLeadsProps): Promise<ConnectedXMResponse<Lead[]>> => {
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

export const useGetSelfLeads = (
  status?: keyof typeof LeadStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSelfLeads>>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfLeads>>>(
    SELF_LEADS_QUERY_KEY(status),
    (params: InfiniteQueryParams) => GetSelfLeads({ ...params, status }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
