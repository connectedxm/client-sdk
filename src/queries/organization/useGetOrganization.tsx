import { ClientAPI } from "@src/ClientAPI";
import type { ConnectedXMResponse, Organization } from "@interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const ORGANIZATION_QUERY_KEY = () => ["ORGANIZATION"];

interface GetOrganizationParams extends SingleQueryParams {}

export const GetOrganization = async ({
  locale,
}: GetOrganizationParams): Promise<ConnectedXMResponse<Organization>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/organization`);
  return data;
};

const useGetOrganization = (
  params: SingleQueryParams = {},
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
