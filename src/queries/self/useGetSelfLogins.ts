import type { Login } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_LOGINS_QUERY_KEY = (): QueryKey => {
  const keys = [...SELF_QUERY_KEY(), "LOGINS"];
  return keys;
};

export interface GetSelfLoginsProps extends InfiniteQueryParams {}

export const GetSelfLogins = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfLoginsProps): Promise<ConnectedXMResponse<Login[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/login/account/logins`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSelfLogins = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSelfLogins>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfLogins>>>(
    SELF_LOGINS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfLogins(params),
    params,
    {
      ...options,
    }
  );
};
