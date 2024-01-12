import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";

export interface SingleQueryParams {
  locale?: string;
}

export interface SingleQueryOptions
  extends Omit<
    UseQueryOptions<unknown, unknown, unknown, string[]>,
    "initialData" | "queryFn" | "queryKey"
  > {}

export const DEFAULT_PAGE_SIZE = 10;

export const GetBaseSingleQueryKeys = (locale: string) => {
  return [locale];
};

export const useConnectedSingleQuery = <TQueryData>(
  queryKeys: string[],
  queryFn: (params: SingleQueryParams) => TQueryData,
  params: SingleQueryParams,
  options?: SingleQueryOptions
) => {
  const { locale } = useConnectedXM();

  return {
    ...useQuery(
      [...queryKeys, ...GetBaseSingleQueryKeys(params?.locale || locale)],
      () => queryFn(params),
      {
        staleTime: 60 * 1000, // 60 Seconds
        retry: options?.retry || 3,
        keepPreviousData: true,
        ...options,
      }
    ),
  };
};

export default useConnectedSingleQuery;
