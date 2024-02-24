import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { API_URL, useConnectedXM } from "../hooks";
import { AxiosError } from "axios";
import { ConnectedXMResponse } from "..";

export interface SingleQueryParams {
  apiUrl: API_URL;
  organizationId: string;
  getToken: () => string | undefined;
  getExecuteAs?: () => string | undefined;
  locale?: string;
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
  const {
    locale,
    onModuleForbidden,
    onNotAuthorized,
    onNotFound,
    apiUrl,
    organizationId,
    getToken,
    getExecuteAs,
  } = useConnectedXM();

  return useQuery<
    TQueryData,
    AxiosError<ConnectedXMResponse<any>>,
    Awaited<TQueryData>,
    QueryKey
  >({
    staleTime: 60 * 1000, // 60 Seconds
    retry: (failureCount, error) => {
      // RESOURCE NOT FOUND
      if (error.response?.status === 404) {
        if (onNotFound) onNotFound(error, queryKeys);
        return false;
      }

      // MODULE FORBIDDEN FOR USER
      if (error.response?.status === 403) {
        if (onModuleForbidden) onModuleForbidden(error, queryKeys);
        return false;
      }

      // TOKEN IS POSSIBLY EXPIRED TRIGGER A REFRESH
      if (error.response?.status === 401) {
        if (onNotAuthorized) onNotAuthorized(error, queryKeys);
        return false;
      }

      // DEFAULT
      if (failureCount < 3) return true;
      return false;
    },
    ...options,
    queryKey: [...queryKeys, ...GetBaseSingleQueryKeys(locale)],
    queryFn: () =>
      queryFn({
        apiUrl,
        organizationId,
        getToken,
        getExecuteAs,
        locale: locale || "en",
      }),
  });
};

export default useConnectedSingleQuery;
