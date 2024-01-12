import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";

export interface SingleQueryParams {
  locale?: string;
}

export interface SingleQueryOptions<TQueryData = unknown>
  extends Omit<
    UseQueryOptions<TQueryData, unknown, Awaited<TQueryData>, string[]>,
    "initialData" | "queryFn" | "queryKey"
  > {
  initialData?: (() => undefined) | undefined;
}

export const GetBaseSingleQueryKeys = (locale: string) => {
  return [locale];
};

export const useConnectedSingleQuery = <TQueryData = unknown>(
  queryKeys: string[],
  queryFn: (params: SingleQueryParams) => TQueryData,
  params: SingleQueryParams,
  options?: SingleQueryOptions<TQueryData>
) => {
  const { locale } = useConnectedXM();

  return {
    ...useQuery<TQueryData, unknown, Awaited<TQueryData>, string[]>(
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
