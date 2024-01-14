import { ConnectedXMResponse } from "../interfaces";
import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";

export interface InfiniteQueryParams {
  pageParam: number;
  pageSize: number;
  orderBy?: string;
  search?: string;
  locale?: string;
  queryClient?: QueryClient;
}

export interface InfiniteQueryOptions<TQueryData>
  extends Omit<
    UseInfiniteQueryOptions<
      TQueryData,
      unknown,
      Awaited<TQueryData>,
      TQueryData,
      string[]
    >,
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

export const useConnectedInfiniteQuery = <
  TQueryData = Promise<ConnectedXMResponse<unknown>>
>(
  queryKeys: string[],
  queryFn: (params: InfiniteQueryParams) => TQueryData,
  params: Omit<InfiniteQueryParams, "queryClient">,
  options?: InfiniteQueryOptions<TQueryData>
) => {
  const queryClient = useQueryClient();
  const { locale } = useConnectedXM();

  const getNextPageParam = (lastPage: any, pages: any[]) => {
    if (lastPage.data?.length === params?.pageSize) {
      return pages.length + 1;
    }
  };

  return useInfiniteQuery<TQueryData, unknown, Awaited<TQueryData>, string[]>(
    [
      ...queryKeys,
      ...GetBaseInfiniteQueryKeys(params?.locale || locale, params?.search),
    ],
    () =>
      queryFn({
        ...params,
        queryClient,
      }),
    {
      staleTime: 60 * 1000, // 60 Seconds
      retry: options?.retry || 3,
      getNextPageParam,
      ...options,
    }
  );
};
