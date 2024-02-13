import { ConnectedXMResponse } from "../interfaces";
import {
  DefaultError,
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { useClientAPI } from "@src/hooks/useClientAPI";
import { AxiosInstance } from "axios";

export interface InfiniteQueryParams {
  pageSize?: number;
  orderBy?: string;
  search?: string;
  locale?: string;
  pageParam: number;
  queryClient: QueryClient;
  clientApi: AxiosInstance;
}

export interface InfiniteQueryOptions<
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
> extends Omit<
    UseInfiniteQueryOptions<
      TQueryData,
      DefaultError,
      InfiniteData<TQueryData, number>,
      TQueryData,
      string[],
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
  queryKeys: string[],
  queryFn: (params: InfiniteQueryParams) => Promise<TQueryData>,
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options?: InfiniteQueryOptions<TQueryData>
) => {
  const { locale } = useConnectedXM();
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
  return useInfiniteQuery<TQueryData,DefaultError,InfiniteData<TQueryData, number>,string[],number>({
    staleTime: 60 * 1000, // 60 Seconds
    retry: options?.retry || 3,
    ...options,
    queryKey: [
      ...queryKeys,
      ...GetBaseInfiniteQueryKeys(params?.locale || locale, params?.search),
    ],
    queryFn: ({ pageParam }) =>
      queryFn({ ...params, pageParam, queryClient, clientApi }),
    initialPageParam: 1,
    getNextPageParam,
  });
};
