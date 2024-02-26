import type { ConnectedXMResponse, Transfer } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { SELF_TRANSFERS_QUERY_KEY } from "./useGetSelfTransfers";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_PENDING_TRANSFER_QUERY_KEY = (
  transferId: string
): QueryKey => [...SELF_TRANSFERS_QUERY_KEY(), transferId];

export interface GetSelfTransferProps extends SingleQueryParams {
  transferId: string;
}

export const GetSelfTransfer = async ({
  transferId,
  clientApiParams,
}: GetSelfTransferProps): Promise<ConnectedXMResponse<Transfer>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/transfers/${transferId}`);
  return data;
};

export const useGetSelfTransfer = (
  transferId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfTransfer>> = {}
) => {
  const { authenticated } = useConnectedXM();
  return useConnectedSingleQuery<ReturnType<typeof GetSelfTransfer>>(
    SELF_PENDING_TRANSFER_QUERY_KEY(transferId),
    (params) => GetSelfTransfer({ ...params, transferId }),
    {
      ...options,
      enabled: !!transferId && authenticated && (options?.enabled ?? true),
    }
  );
};
