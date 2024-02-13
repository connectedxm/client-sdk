import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { useClientAPI } from "@src/hooks/useClientAPI";
import { AxiosInstance } from "axios";

export interface SingleQueryParams {
  clientApi: AxiosInstance;
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
  params: Omit<SingleQueryParams, "clientApi">,
  options?: SingleQueryOptions<TQueryData>
) => {
  const { locale } = useConnectedXM();
  const clientApi = useClientAPI(locale);

  return useQuery<TQueryData, unknown, Awaited<TQueryData>, string[]>({
    queryKey: [...queryKeys, ...GetBaseSingleQueryKeys(locale)],
    queryFn: () =>
      queryFn({
        ...params,
        clientApi,
      }),
    staleTime: 60 * 1000, // 60 Seconds
    retry: options?.retry || 3,
    keepPreviousData: true,
    ...options,
  });
};

export default useConnectedSingleQuery;
