import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import type {
  BaseAccount,
  BaseCommunity,
  BaseEvent,
  Content,
} from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

import {
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

export const QUERY_KEY = "ORGANIZATION_EXPLORE";

const useGetOrganizationExplore = () => {
  const queryClient = useQueryClient();

  return useConnectedSingleQuery<ConnectedXMResponse<Explore>>(
    [QUERY_KEY],
    (params: any) => GetOrganizationExplore({ ...params })
  );
};

export default useGetOrganizationExplore;
