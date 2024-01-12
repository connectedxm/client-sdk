import { ConnectedXMResponse } from "../interfaces";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";

export interface InfiniteQueryParams {
  pageParam: number;
  pageSize: number;
  orderBy?: string;
  search?: string;
  locale?: string;
}

export interface InfiniteQueryOptions<TQueryData>
  extends Omit<
    UseInfiniteQueryOptions<TQueryData, unknown, unknown, TQueryData, string[]>,
    "queryKey" | "queryFn"
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

export const useConnectedInfiniteQuery = <TQueryData = unknown>(
  queryKeys: string[],
  queryFn: (params: InfiniteQueryParams) => TQueryData,
  params: InfiniteQueryParams,
  options?: InfiniteQueryOptions<TQueryData>
) => {
  const { locale } = useConnectedXM();

  const getNextPageParam = (lastPage: any, pages: any[]) => {
    if (lastPage.data?.length === params?.pageSize) {
      return pages.length + 1;
    }
  };

  return useInfiniteQuery<TQueryData, unknown, unknown, string[]>(
    [
      ...queryKeys,
      ...GetBaseInfiniteQueryKeys(params?.locale || locale, params?.search),
    ],
    () => queryFn(params),
    {
      staleTime: 60 * 1000, // 60 Seconds
      retry: options?.retry || 3,
      getNextPageParam,
      ...options,
    }
  );
};
