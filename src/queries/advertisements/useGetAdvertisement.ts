import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import type { Advertisement } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const ADVERTISEMENT_QUERY_KEY = (position: string) => [
  "ADVERTISEMENT",
  position,
];

export const SET_ADVERTISEMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ADVERTISEMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisement>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ADVERTISEMENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetAdvertisementProps extends SingleQueryParams {}

export const GetAdvertisement = async ({
  locale,
}: GetAdvertisementProps): Promise<ConnectedXMResponse<Advertisement>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/advertisement`);
  return data;
};

const useGetAdvertisement = (position: string, enabled: boolean = true) => {
  return useConnectedSingleQuery<Awaited<ReturnType<typeof GetAdvertisement>>>(
    ADVERTISEMENT_QUERY_KEY(position),
    (params: any) => GetAdvertisement({ ...params }),
    {
      staleTime: 30 * 1000,
      enabled: enabled,
    }
  );
};

export default useGetAdvertisement;
