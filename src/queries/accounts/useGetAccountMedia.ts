import { Activity } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_MEDIA_QUERY_KEY = (
  accountId: string,
  type?: "images" | "videos"
): QueryKey => [...ACCOUNT_QUERY_KEY(accountId), "MEDIA", type || "all"];

export interface GetAccountMediaProps extends InfiniteQueryParams {
  accountId: string;
  type?: "images" | "videos";
}

export const GetAccountMedia = async ({
  accountId,
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetAccountMediaProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}/media`, {
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

export const useGetAccountMedia = (
  accountId: string = "",
  type?: "images" | "videos",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountMedia>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccountMedia>>>(
    ACCOUNT_MEDIA_QUERY_KEY(accountId, type),
    (params: InfiniteQueryParams) =>
      GetAccountMedia({ accountId, type, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
