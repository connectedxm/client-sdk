import { ConnectedXMResponse } from "../interfaces";
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { AxiosError } from "axios";
import { ClientApiParams } from "@src/ClientAPI";
import { CUSTOM_ERROR_CODES } from "@src/utilities";

export interface InfiniteQueryParams {
  pageParam: number;
  clientApiParams: ClientApiParams;
  pageSize?: number;
  orderBy?: string;
  search?: string;
  locale?: string;
  queryClient?: QueryClient;
}

export interface InfiniteQueryOptions<
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
> extends Omit<
    UseInfiniteQueryOptions<
      TQueryData,
      AxiosError<ConnectedXMResponse<null>>,
      InfiniteData<TQueryData, number>,
      QueryKey,
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > {
  shouldRedirect?: boolean;
}

export const GetBaseInfiniteQueryKeys = (
  locale: string,
  search: string = ""
) => {
  return [locale, search];
};

export const setFirstPageData = <TData>(
  response: ConnectedXMResponse<TData>
): InfiniteData<ConnectedXMResponse<TData>> => {
  return {
    pages: [response],
    pageParams: [null],
  };
};

export const useConnectedInfiniteQuery = <
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
>(
  queryKeys: QueryKey,
  queryFn: (params: InfiniteQueryParams) => Promise<TQueryData>,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<TQueryData> = {
    shouldRedirect: false,
  }
) => {
  if (typeof params.pageSize === "undefined") params.pageSize = 10;

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
  } = useConnectedXM();

  const getNextPageParam = (
    lastPage: TQueryData, // Use the PageData interface
    allPages: TQueryData[] // Array of PageData
  ) => {
    // Assuming lastPage.data is an array and you're checking its length
    if (lastPage.data.length === params.pageSize) {
      return allPages.length + 1;
    }

    return undefined; // Ensure to return undefined if there's no next page
  };

  // prettier-ignore
  return useInfiniteQuery<TQueryData,AxiosError<ConnectedXMResponse<null>>,InfiniteData<TQueryData, number>,QueryKey,number>({
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
      queryFn({ ...params, pageSize: params.pageSize || 25, locale: params.locale || locale, pageParam, queryClient, clientApiParams: {
        apiUrl,
        getToken,
        organizationId,
        getExecuteAs,
         locale
      } }),
    initialPageParam: 1,
    getNextPageParam,
  });
};
