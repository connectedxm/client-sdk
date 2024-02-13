import type { ConnectedXMResponse, Organization } from "@interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const ORGANIZATION_QUERY_KEY = () => ["ORGANIZATION"];

interface GetOrganizationParams extends SingleQueryParams {}

export const GetOrganization = async ({
  clientApi,
}: GetOrganizationParams): Promise<ConnectedXMResponse<Organization>> => {
  const { data } = await clientApi.get(`/organization`);
  return data;
};

const useGetOrganization = (
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetOrganization>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganization>>(
    ORGANIZATION_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganization({ ...params }),
    params,
    options
  );
};

export default useGetOrganization;
