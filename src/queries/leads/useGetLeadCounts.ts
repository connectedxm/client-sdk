import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ConnectedXMResponse, LeadStatus } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { LEADS_QUERY_KEY } from "./useGetLeads";

export const LEAD_COUNTS_QUERY_KEY = (): QueryKey => {
  const keys = [...LEADS_QUERY_KEY(), "COUNTS"];
  return keys;
};

export interface GetLeadCountsProps extends SingleQueryParams {}

export const GetLeadCounts = async ({
  clientApiParams,
}: GetLeadCountsProps): Promise<
  ConnectedXMResponse<Record<LeadStatus, number>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/leads/counts`);

  return data;
};

export const useGetLeadCounts = (
  options: SingleQueryOptions<ReturnType<typeof GetLeadCounts>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetLeadCounts>>(
    LEAD_COUNTS_QUERY_KEY(),
    (params: SingleQueryParams) => GetLeadCounts({ ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
