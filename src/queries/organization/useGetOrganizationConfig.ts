import type { ConnectedXMResponse, OrganizationConfig } from "@interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const ORGANIZATION_CONFIG_QUERY_KEY = (): QueryKey => [
  "ORGANIZATION_CONFIG",
];

export interface GetOrganizationConfigParams extends SingleQueryParams {}

export const GetOrganizationConfig = async ({
  clientApiParams,
}: GetOrganizationConfigParams): Promise<
  ConnectedXMResponse<OrganizationConfig>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/organization/config`);
  return data;
};

export const useGetOrganizationConfig = (
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationConfig>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationConfig>>(
    ORGANIZATION_CONFIG_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationConfig({ ...params }),
    options
  );
};
