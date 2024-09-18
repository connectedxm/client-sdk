import type { Group } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { GROUPS_QUERY_KEY } from "./useGetGroups";

export const GROUPS_INVITED_QUERY_KEY = (rejected?: boolean): QueryKey => {
  const keys = [...GROUPS_QUERY_KEY(), "INVITED"];
  if (typeof rejected === "boolean") {
    keys.push(rejected ? "REJECTED" : "NEW");
  }
  return keys;
};

export interface GetGroupsInvitedProps extends InfiniteQueryParams {
  rejected?: boolean;
}

export const GetGroupsInvited = async ({
  rejected,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetGroupsInvitedProps): Promise<ConnectedXMResponse<Group[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/invited`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      rejected,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (groupId) => GROUP_QUERY_KEY(groupId),
      locale
    );
  }

  return data;
};

export const useGetGroupsInvited = (
  rejected?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupsInvited>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupsInvited>>
  >(
    GROUPS_INVITED_QUERY_KEY(rejected),
    (params: InfiniteQueryParams) => GetGroupsInvited({ rejected, ...params }),
    params,
    options
  );
};
