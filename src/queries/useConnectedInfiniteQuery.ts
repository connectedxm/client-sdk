import { ConnectedXMResponse } from "../interfaces";
import {
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
  pageParam: number;
  pageSize: number;
  orderBy?: string;
  search?: string;
  locale?: string;
  queryClient: QueryClient;
  clientApi: AxiosInstance;
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
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options?: InfiniteQueryOptions<TQueryData>
) => {
  const { locale } = useConnectedXM();
  const queryClient = useQueryClient();
  const clientApi = useClientAPI(locale);

  const getNextPageParam = (lastPage: any, pages: any[]) => {
    if (lastPage.data?.length === params?.pageSize) {
      return pages.length + 1;
    }
  };

  return useInfiniteQuery<TQueryData, unknown, Awaited<TQueryData>, string[]>({
    queryKey: [
      ...queryKeys,
      ...GetBaseInfiniteQueryKeys(params?.locale || locale, params?.search),
    ],
    queryFn: () =>
      queryFn({
        ...params,
        queryClient,
        clientApi,
      }),
    staleTime: 60 * 1000, // 60 Seconds
    retry: options?.retry || 3,
    getNextPageParam,
    ...options,
  });
};
