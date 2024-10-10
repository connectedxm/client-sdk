import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { AxiosError } from "axios";
import { ConnectedXMResponse } from "..";
import { ClientApiParams } from "@src/ClientAPI";

export interface SingleQueryParams {
  clientApiParams: ClientApiParams;
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
  > {
  shouldRedirect?: boolean;
}

export const GetBaseSingleQueryKeys = (locale: string): QueryKey => {
  return [locale];
};

export const ERR_NOT_GROUP_MEMBER = 453;
export const ERR_NOT_EVENT_REGISTERED = 454;
export const ERR_REGISTRATION_UNAVAILABLE = 455;
export const ERR_FEATURE_NOT_AVAILABLE = 456;
export const ERR_TIER_REQUIRED = 457;
export const ERR_SUBSCRIPTION_REQUIRED = 458;

export const CUSTOM_ERROR_CODES = [
  ERR_NOT_GROUP_MEMBER,
  ERR_NOT_EVENT_REGISTERED,
  ERR_REGISTRATION_UNAVAILABLE,
  ERR_FEATURE_NOT_AVAILABLE,
  ERR_TIER_REQUIRED,
  ERR_SUBSCRIPTION_REQUIRED,
];

export const useConnectedSingleQuery = <TQueryData = unknown>(
  queryKeys: QueryKey,
  queryFn: (params: SingleQueryParams) => TQueryData,
  options: SingleQueryOptions<TQueryData> = {}
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

  // prettier-ignore
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
        if (onNotFound) onNotFound(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // MODULE FORBIDDEN FOR USER
      if (error.response?.status === 403 || !!error.response?.status && CUSTOM_ERROR_CODES.includes(error.response.status)) {
        if (onModuleForbidden) onModuleForbidden(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // TOKEN IS POSSIBLY EXPIRED TRIGGER A REFRESH
      if (error.response?.status === 401) {
        if (onNotAuthorized) onNotAuthorized(error, queryKeys, options.shouldRedirect || false);
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
        clientApiParams: {
          apiUrl,
          organizationId,
          getToken,
          getExecuteAs,
          locale,
        },
      }),
  });
};

export default useConnectedSingleQuery;
