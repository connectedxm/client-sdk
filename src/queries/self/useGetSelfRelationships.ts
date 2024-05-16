import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, SelfRelationships } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { useConnectedXM } from "@src/hooks";

export const SELF_RELATIONSHIPS_QUERY_KEY = (): QueryKey => {
  const keys = [...SELF_QUERY_KEY(), "RELATIONSHIPS"];
  return keys;
};

export const ADD_SELF_RELATIONSHIP = (
  client: QueryClient,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  type: "communities" | "accounts" | "events",
  id: string
) => {
  client.setQueryData(
    [...SELF_RELATIONSHIPS_QUERY_KEY(), ...GetBaseSingleQueryKeys(...baseKeys)],
    (prev: SelfRelationships) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: true,
      },
    })
  );
};

export const REMOVE_SELF_RELATIONSHIP = (
  client: QueryClient,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  type: "communities" | "accounts" | "events",
  id: string
) => {
  client.setQueryData(
    [...SELF_RELATIONSHIPS_QUERY_KEY(), ...GetBaseSingleQueryKeys(...baseKeys)],
    (prev: SelfRelationships) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: false,
      },
    })
  );
};

export interface GetSelfRelationshipsProps extends SingleQueryParams {}

export const GetSelfRelationships = async ({
  clientApiParams,
}: GetSelfRelationshipsProps): Promise<
  ConnectedXMResponse<SelfRelationships>
> => {
  const clientApi = await GetClientAPI({
    ...clientApiParams,
  });

  const { data } = await clientApi.get(`/self/relationships`);

  return data;
};

export const useGetSelfRelationships = (
  options: SingleQueryOptions<ReturnType<typeof GetSelfRelationships>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfRelationships>>(
    SELF_RELATIONSHIPS_QUERY_KEY(),
    (params: SingleQueryParams) => GetSelfRelationships({ ...params }),
    {
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
