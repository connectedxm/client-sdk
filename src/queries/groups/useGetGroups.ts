import type { Group } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUPS_QUERY_KEY = (access?: "public" | "private"): QueryKey => {
  const keys = ["GROUPS"];
  if (access) keys.push(access);
  return keys;
};

export interface GetGroupsProps extends InfiniteQueryParams {
  access?: "public" | "private";
}

export const GetGroups = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  access,
  clientApiParams,
}: GetGroupsProps): Promise<ConnectedXMResponse<Group[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      access: access || undefined,
    },
  });

  return data;
};

export const useGetGroups = (
  access?: "public" | "private",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetGroups>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroups>>>(
    GROUPS_QUERY_KEY(access),
    (params: InfiniteQueryParams) => GetGroups({ access, ...params }),
    params,
    options
  );
};
