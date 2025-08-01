import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";

import type { Lead, ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_LEADS_QUERY_KEY } from "./useGetSelfLeads";

export const SELF_LEAD_QUERY_KEY = (leadId: string): QueryKey => {
  const keys = [...SELF_LEADS_QUERY_KEY(), leadId];
  return keys;
};

export interface GetSelfLeadProps extends SingleQueryParams {
  leadId: string;
}

export const GetSelfLead = async ({
  leadId,
  clientApiParams,
}: GetSelfLeadProps): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/leads/${leadId}`);

  return data;
};

export const useGetSelfLead = (
  leadId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfLead>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfLead>>(
    SELF_LEAD_QUERY_KEY(leadId),
    (params: SingleQueryParams) => GetSelfLead({ leadId, ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
