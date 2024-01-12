import { ClientAPI } from "@src/ClientAPI";
import type { Organization } from "@interfaces";
import useConnectedSingleQuery, {
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

const useGetOrganization = () => {
  return useConnectedSingleQuery<ConnectedXMResponse<Organization>>(
    ORGANIZATION_QUERY_KEY(),
    (params: any) => GetOrganization({ ...params })
  );
};

export default useGetOrganization;
