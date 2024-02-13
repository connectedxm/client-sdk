import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

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
  clientApi,
}: GetAdvertisementProps): Promise<ConnectedXMResponse<Advertisement>> => {
  const { data } = await clientApi.get(`/advertisement`);
  return data;
};

export const useGetAdvertisement = (
  position: string,
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetAdvertisement>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAdvertisement>>(
    ADVERTISEMENT_QUERY_KEY(position),
    (params: any) => GetAdvertisement({ ...params }),
    params,
    {
      staleTime: 30 * 1000,
      ...options,
    }
  );
};

export default useGetAdvertisement;
