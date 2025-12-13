import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { Lead, ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { LEADS_QUERY_KEY } from "./useGetLeads";

export const LEAD_QUERY_KEY = (leadId: string): QueryKey => {
  const keys = [...LEADS_QUERY_KEY(), leadId];
  return keys;
};

export interface GetLeadProps extends SingleQueryParams {
  leadId: string;
}

export const GetLead = async ({
  leadId,
  clientApiParams,
}: GetLeadProps): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/leads/${leadId}`);

  return data;
};

export const useGetLead = (
  leadId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLead>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetLead>>(
    LEAD_QUERY_KEY(leadId),
    (params: SingleQueryParams) => GetLead({ leadId, ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
