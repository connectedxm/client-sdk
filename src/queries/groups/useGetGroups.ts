import type { Group } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUPS_QUERY_KEY = (access?: "public" | "private"): QueryKey => {
  const keys = ["GROUPS"];
  if (access) keys.push(access);
  return keys;
};

export const SET_GROUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroups>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...GROUPS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
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
