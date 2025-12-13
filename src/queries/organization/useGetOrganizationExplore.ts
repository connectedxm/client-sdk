import type {
  BaseAccount,
  BaseGroup,
  BaseEvent,
  ConnectedXMResponse,
  Content,
} from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const ORGANIZATION_EXPLORE_QUERY_KEY = (): QueryKey => [
  ...ORGANIZATION_QUERY_KEY(),
  "ORGANIZATION",
];

interface Explore {
  contents: Content[];
  events: BaseEvent[];
  groups: BaseGroup[];
  recommendations: BaseAccount[];
}

export interface GetOrganizationExploreProps extends SingleQueryParams {}

export const GetOrganizationExplore = async ({
  clientApiParams,
}: GetOrganizationExploreProps): Promise<ConnectedXMResponse<Explore>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
