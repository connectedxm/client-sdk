import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";

import type { ConnectedXMResponse, Self } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_ADDRESSES_QUERY_KEY } from "./useGetSelfAddresses";

export const SELF_ADDRESS_QUERY_KEY = (addressId: string): QueryKey => {
  const keys = [...SELF_ADDRESSES_QUERY_KEY(), addressId];
  return keys;
};

export interface GetSelfAddressProps extends SingleQueryParams {
  addressId: string;
}

export const GetSelfAddress = async ({
  addressId,
  clientApiParams,
}: GetSelfAddressProps): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/addresses/${addressId}`);

  return data;
};

export const useGetSelfAddress = (
  addressId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfAddress>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfAddress>>(
    SELF_ADDRESS_QUERY_KEY(addressId),
    (params: SingleQueryParams) => GetSelfAddress({ addressId, ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
