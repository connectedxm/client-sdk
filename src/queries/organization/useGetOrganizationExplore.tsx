import { ClientAPI } from "@src/ClientAPI";
import type {
  BaseAccount,
  BaseCommunity,
  BaseEvent,
  ConnectedXMResponse,
  Content,
} from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";

export const ORGANIZATION_EXPLORE_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "ORGANIZATION",
];

interface Explore {
  contents: Content[];
  events: BaseEvent[];
  communities: BaseCommunity[];
  recommendations: BaseAccount[];
}
interface GetOrganizationExploreProps extends SingleQueryParams {}

export const GetOrganizationExplore = async ({
  locale,
}: GetOrganizationExploreProps): Promise<ConnectedXMResponse<Explore>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/organization/explore`);

  return data;
};

const useGetOrganizationExplore = (
  params: SingleQueryParams = {},
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationExplore>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationExplore>>(
    ORGANIZATION_EXPLORE_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationExplore({ ...params }),
    params,
    options
  );
};

export default useGetOrganizationExplore;
