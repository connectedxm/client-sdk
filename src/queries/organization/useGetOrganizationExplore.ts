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
  clientApi,
}: GetOrganizationExploreProps): Promise<ConnectedXMResponse<Explore>> => {
  const { data } = await clientApi.get(`/organization/explore`);

  return data;
};

export const useGetOrganizationExplore = (
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationExplore>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationExplore>>(
    ORGANIZATION_EXPLORE_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationExplore({ ...params }),
    options
  );
};
