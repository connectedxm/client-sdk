import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { useClientAPI } from "@src/hooks/useClientAPI";
import { AxiosError, AxiosInstance } from "axios";
import { ConnectedXMResponse } from "..";

export interface SingleQueryParams {
  clientApi: AxiosInstance;
}

export interface SingleQueryOptions<TQueryData = unknown>
  extends Omit<
    UseQueryOptions<
      TQueryData,
      AxiosError<ConnectedXMResponse<any>>,
      Awaited<TQueryData>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  > {}

export const GetBaseSingleQueryKeys = (locale: string): QueryKey => {
  return [locale];
};

export const useConnectedSingleQuery = <TQueryData = unknown>(
  queryKeys: QueryKey,
  queryFn: (params: SingleQueryParams) => TQueryData,
  options?: SingleQueryOptions<TQueryData>
) => {
  const { locale, refreshToken } = useConnectedXM();
  const clientApi = useClientAPI(locale);

  return useQuery<
    TQueryData,
    AxiosError<ConnectedXMResponse<any>>,
    Awaited<TQueryData>,
    QueryKey
  >({
    staleTime: 60 * 1000, // 60 Seconds
    retry: (failureCount, error) => {
      // RESOURCE NOT FOUND
      if (error.status === 404) return false;

      // USER DOES NOT HAVE PERMISSION
      if (error.status === 403) return false;

      // TOKEN IS POSSIBLY EXPIRED
      if (error.status === 401) {
        if (refreshToken && failureCount < 2) {
          refreshToken();
          return true;
        } else {
          return false;
        }
      }

      // DEFAULT
      if (failureCount < 3) return true;
      return false;
    },
    ...options,
    queryKey: [...queryKeys, ...GetBaseSingleQueryKeys(locale)],
    queryFn: () =>
      queryFn({
        clientApi,
      }),
  });
};

export default useConnectedSingleQuery;
