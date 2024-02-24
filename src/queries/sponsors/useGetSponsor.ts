import type { Account, ConnectedXMResponse } from "@interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SPONSORS_QUERY_KEY } from "./useGetSponsors";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SPONSOR_QUERY_KEY = (sponsorId: string): QueryKey => [
  ...SPONSORS_QUERY_KEY(),
  sponsorId,
];

export const SET_SPONSOR_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSOR_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsor>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SPONSOR_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSponsorProps extends SingleQueryParams {
  accountId: string;
}

export const GetSponsor = async ({
  accountId,
  clientApiParams,
}: GetSponsorProps): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/sponsors/${accountId}`);
  return data;
};

export const useGetSponsor = (
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSponsor>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSponsor>>(
    SPONSOR_QUERY_KEY(accountId),
    (params) => GetSponsor({ accountId, ...params }),
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
