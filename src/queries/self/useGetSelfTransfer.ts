import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { ConnectedXMResponse, Transfer } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { SELF_TRANSFERS_QUERY_KEY } from "./useGetSelfTransfers";

export const SELF_PENDING_TRANSFER_QUERY_KEY = (transferId: string) => [
  ...SELF_TRANSFERS_QUERY_KEY(),
  transferId,
];

interface GetSelfTransferProps extends SingleQueryParams {
  transferId: string;
}

export const GetSelfTransfer = async ({
  transferId,
  clientApi,
}: GetSelfTransferProps): Promise<ConnectedXMResponse<Transfer>> => {
  const { data } = await clientApi.get(`/self/transfers/${transferId}`);
  return data;
};

const useGetSelfTransfer = (
  transferId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfTransfer>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfTransfer>>(
    SELF_PENDING_TRANSFER_QUERY_KEY(transferId),
    (params) => GetSelfTransfer({ ...params, transferId }),
    {
      ...options,
      enabled: !!token && !!transferId && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfTransfer;
