import { Activity } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_MEDIA_QUERY_KEY = (
  groupId: string,
  type?: "images" | "videos"
): QueryKey => [...GROUP_QUERY_KEY(groupId), "MEDIA", type || "all"];

export interface GetGroupMediaProps extends InfiniteQueryParams {
  groupId: string;
  type?: "images" | "videos";
}

export const GetGroupMedia = async ({
  groupId,
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetGroupMediaProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/media`, {
    params: {
      type: type || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupMedia = (
  groupId: string = "",
  type?: "images" | "videos",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetGroupMedia>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupMedia>>>(
    GROUP_MEDIA_QUERY_KEY(groupId, type),
    (params: InfiniteQueryParams) =>
      GetGroupMedia({ groupId, type, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
