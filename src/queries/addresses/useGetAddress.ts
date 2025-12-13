import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { AccountAddress, ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { ADDRESSES_QUERY_KEY } from "./useGetAddresses";

export const ADDRESS_QUERY_KEY = (addressId: string): QueryKey => {
  const keys = [...ADDRESSES_QUERY_KEY(), addressId];
  return keys;
};

export interface GetAddressProps extends SingleQueryParams {
  addressId: string;
}

export const GetAddress = async ({
  addressId,
  clientApiParams,
}: GetAddressProps): Promise<ConnectedXMResponse<AccountAddress>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/addresses/${addressId}`);

  return data;
};

export const useGetAddress = (
  addressId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAddress>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetAddress>>(
    ADDRESS_QUERY_KEY(addressId),
    (params: SingleQueryParams) => GetAddress({ addressId, ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
