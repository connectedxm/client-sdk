import { ConnectedXMResponse } from "../interfaces";
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { useClientAPI } from "@src/hooks/useClientAPI";
import { AxiosError, AxiosInstance } from "axios";

export interface InfiniteQueryParams {
  pageSize?: number;
  orderBy?: string;
  search?: string;
  locale?: string;
  pageParam: number;
  clientApi: AxiosInstance;
  queryClient?: QueryClient;
  token?: string;
}

export interface InfiniteQueryOptions<
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
> extends Omit<
    UseInfiniteQueryOptions<
      TQueryData,
      AxiosError<ConnectedXMResponse<null>>,
      InfiniteData<TQueryData, number>,
      TQueryData,
      QueryKey,
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > {}

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
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options?: InfiniteQueryOptions<TQueryData>
) => {
  const { locale, onModuleForbidden, onNotAuthorized, onNotFound, setToken } =
    useConnectedXM();

  const queryClient = useQueryClient();
  const clientApi = useClientAPI(locale);

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
        if (onNotFound) onNotFound(error, queryKeys, setToken);
        return false;
      }

      // MODULE FORBIDDEN FOR USER
      if (error.response?.status === 403) {
        if (onModuleForbidden) onModuleForbidden(error, queryKeys, setToken);
        return false;
      }

      // TOKEN IS POSSIBLY EXPIRED TRIGGER A REFRESH
      if (error.response?.status === 401) {
        if (onNotAuthorized) onNotAuthorized(error, queryKeys, setToken);
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
      queryFn({ ...params, pageSize: params.pageSize || 25, locale: params.locale || locale, pageParam, queryClient, clientApi }),
    initialPageParam: 1,
    getNextPageParam,
  });
};
