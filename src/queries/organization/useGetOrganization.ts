import type { ConnectedXMResponse, Organization } from "@interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const ORGANIZATION_QUERY_KEY = (): QueryKey => ["ORGANIZATION"];

export interface GetOrganizationParams extends SingleQueryParams {}

export const GetOrganization = async ({
  clientApiParams,
}: GetOrganizationParams): Promise<ConnectedXMResponse<Organization>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/organization`);
  return data;
};

export const useGetOrganization = (
  options: SingleQueryOptions<ReturnType<typeof GetOrganization>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganization>>(
    ORGANIZATION_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganization({ ...params }),
    options
  );
};
