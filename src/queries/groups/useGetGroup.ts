import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Group } from "@interfaces";
import { GROUPS_QUERY_KEY } from "./useGetGroups";
import { QueryClient, SetDataOptions, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_QUERY_KEY = (groupId: string): QueryKey => [
  ...GROUPS_QUERY_KEY(),
  groupId,
];

export const SET_GROUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroup>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [...GROUP_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response,
    options
  );
};

export interface GetGroupProps extends SingleQueryParams {
  groupId: string;
}

export const GetGroup = async ({
  groupId,
  clientApiParams,
}: GetGroupProps): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}`);
  return data;
};

export const useGetGroup = (
  groupId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroup>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroup>>(
    GROUP_QUERY_KEY(groupId),
    (params) => GetGroup({ groupId, ...params }),
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
