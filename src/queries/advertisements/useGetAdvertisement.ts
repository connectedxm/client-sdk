import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Advertisement } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ADVERTISEMENT_QUERY_KEY = (position: string): QueryKey => [
  "ADVERTISEMENT",
  position,
];

export interface GetAdvertisementProps extends SingleQueryParams {}

export const GetAdvertisement = async ({
  clientApiParams,
}: GetAdvertisementProps): Promise<ConnectedXMResponse<Advertisement>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/advertisement`);
  return data;
};

export const useGetAdvertisement = (
  position: string,
  options: SingleQueryOptions<ReturnType<typeof GetAdvertisement>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAdvertisement>>(
    ADVERTISEMENT_QUERY_KEY(position),
    (params: any) => GetAdvertisement({ ...params }),
    {
      staleTime: 30 * 1000,
      ...options,
    }
  );
};
