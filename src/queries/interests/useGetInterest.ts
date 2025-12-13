import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { Interest, ConnectedXMResponse } from "@interfaces";
import { INTERESTS_QUERY_KEY } from "./useGetInterests";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const INTEREST_QUERY_KEY = (interest: string): QueryKey => [
  ...INTERESTS_QUERY_KEY(),
  interest,
];

export interface GetInterestProps extends SingleQueryParams {
  interest: string;
}

export const GetInterest = async ({
  interest,
  clientApiParams,
}: GetInterestProps): Promise<ConnectedXMResponse<Interest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/interests/${interest}`);
  return data;
};

export const useGetInterest = (
  interest: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetInterest>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInterest>>(
    INTEREST_QUERY_KEY(interest),
    (_params) => GetInterest({ interest, ..._params }),
    {
      ...options,
      enabled: !!interest && (options?.enabled ?? true),
    }
  );
};
