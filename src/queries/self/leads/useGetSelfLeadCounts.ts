import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";

import type { ConnectedXMResponse, LeadStatus } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_LEADS_QUERY_KEY } from "./useGetSelfLeads";

export const SELF_LEAD_COUNTS_QUERY_KEY = (): QueryKey => {
  const keys = [...SELF_LEADS_QUERY_KEY(), "COUNTS"];
  return keys;
};

export interface GetSelfLeadCountsProps extends SingleQueryParams {}

export const GetSelfLeadCounts = async ({
  clientApiParams,
}: GetSelfLeadCountsProps): Promise<
  ConnectedXMResponse<Record<LeadStatus, number>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/leads/counts`);

  return data;
};

export const useGetSelfLeadCounts = (
  options: SingleQueryOptions<ReturnType<typeof GetSelfLeadCounts>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfLeadCounts>>(
    SELF_LEAD_COUNTS_QUERY_KEY(),
    (params: SingleQueryParams) => GetSelfLeadCounts({ ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
