import { ConnectedXMResponse } from "../interfaces";
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useConnected } from "../hooks";
import { AxiosError } from "axios";
import { ClientApiParams } from "@src/ClientAPI";
import { CUSTOM_ERROR_CODES } from "@src/utilities";
import { GetBaseInfiniteQueryKeys } from "./useConnectedInfiniteQuery";

export interface CursorQueryParams {
  clientApiParams: ClientApiParams;
  cursor: string | number | null;
  pageSize?: number;
  search?: string;
  locale?: string;
  queryClient?: QueryClient;
}

export interface CursorQueryOptions<
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
> extends Omit<
    UseInfiniteQueryOptions<
      TQueryData,
      AxiosError<ConnectedXMResponse<null>>,
      InfiniteData<TQueryData, string | number | null>,
      QueryKey,
      string | number | null
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > {
  shouldRedirect?: boolean;
}

export const useConnectedCursorQuery = <
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
>(
  queryKeys: QueryKey,
  queryFn: (params: CursorQueryParams) => Promise<TQueryData>,
  params: Omit<
    CursorQueryParams,
    "cursor" | "queryClient" | "clientApiParams"
  > = {},
  options: CursorQueryOptions<TQueryData> = {
    shouldRedirect: false,
  }
) => {
  if (typeof params.pageSize === "undefined") params.pageSize = 25;

  const {
    locale,
    onModuleForbidden,
    onNotAuthorized,
    onNotFound,
    apiUrl,
    getToken,
    organizationId,
    getExecuteAs,
    queryClient,
  } = useConnected();

  const getNextPageParam = (lastPage: TQueryData): string | number | null => {
    if (lastPage.cursor) {
      return lastPage.cursor;
    }
    return null;
  };

  // prettier-ignore
  return useInfiniteQuery<TQueryData, AxiosError<ConnectedXMResponse<null>>, InfiniteData<TQueryData, string | number | null>, QueryKey, string | number | null>({
    staleTime: 60 * 1000, // 60 Seconds
    retry: (failureCount, error) => {
      // RESOURCE NOT FOUND
      if (error.response?.status === 404) {
        if (onNotFound) onNotFound(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // MODULE FORBIDDEN FOR USER
      if (error.response?.status === 403 || !!error.response?.status && CUSTOM_ERROR_CODES.includes(error.response.status)) {
        if (onModuleForbidden) onModuleForbidden(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // TOKEN IS POSSIBLY EXPIRED TRIGGER A REFRESH
      if (error.response?.status === 401) {
        if (onNotAuthorized) onNotAuthorized(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // DEFAULT
      if (failureCount < 3) return true;
      return false;
    },
    ...options,
    queryKey: [
      ...queryKeys,
      ...GetBaseInfiniteQueryKeys(params?.locale || locale, params?.search),
    ],
    queryFn: ({ pageParam }) =>
      queryFn({ 
        ...params, 
        pageSize: params.pageSize || 25, 
        locale: params.locale || locale, 
        cursor: pageParam,
        queryClient, 
        clientApiParams: {
          apiUrl,
          getToken,
          organizationId,
          getExecuteAs,
          locale
        } 
      }),
    initialPageParam: null,
    getNextPageParam,
  });
};
