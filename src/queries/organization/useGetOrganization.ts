import type { ConnectedXMResponse, Organization } from "@interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";

export const ORGANIZATION_QUERY_KEY = (): QueryKey => ["ORGANIZATION"];

interface GetOrganizationParams extends SingleQueryParams {}

export const GetOrganization = async ({
  clientApi,
}: GetOrganizationParams): Promise<ConnectedXMResponse<Organization>> => {
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
