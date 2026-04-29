import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import type { Group } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface GroupsExploreData {
  featuredGroups: Group[];
  publicGroups: Group[];
  privateGroups: Group[];
}

export const GROUPS_EXPLORE_QUERY_KEY = (): QueryKey => ["GROUPS_EXPLORE"];

export const SET_GROUPS_EXPLORE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUPS_EXPLORE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupsExplore>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...GROUPS_EXPLORE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetGroupsExploreProps extends SingleQueryParams {}

export const GetGroupsExplore = async ({
  clientApiParams,
}: GetGroupsExploreProps): Promise<ConnectedXMResponse<GroupsExploreData>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/explore`);
  return data;
};

export const useGetGroupsExplore = (
  options: SingleQueryOptions<ReturnType<typeof GetGroupsExplore>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupsExplore>>(
    GROUPS_EXPLORE_QUERY_KEY(),
    (params) => GetGroupsExplore({ ...params }),
    options
  );
};
