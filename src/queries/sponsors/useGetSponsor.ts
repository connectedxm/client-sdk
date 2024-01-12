import { ClientAPI } from "@src/ClientAPI";
import type { Account } from "@interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SPONSORS_QUERY_KEY } from "./useGetSponsors";
import { QueryClient } from "@tanstack/react-query";

export const SPONSOR_QUERY_KEY = (sponsorId: string) => [
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

interface GetSponsorProps extends SingleQueryParams {
  accountId: string;
}

export const GetSponsor = async ({
  accountId,
  locale,
}: GetSponsorProps): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/sponsors/${accountId}`);
  return data;
};

const useGetSponsor = (accountId: string) => {
  return useConnectedSingleQuery<Awaited<ReturnType<typeof GetSponsor>>>(
    SPONSOR_QUERY_KEY(accountId),
    (params) => GetSponsor({ accountId, ...params }),
    {
      enabled: !!accountId,
    }
  );
};

export default useGetSponsor;
