import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { Transfer } from "@interfaces";
import {
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
  locale,
}: GetSelfTransferProps): Promise<ConnectedXMResponse<Transfer>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/transfers/${transferId}`);
  return data;
};

const useGetSelfTransfer = (transferId: string = "") => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<Awaited<ReturnType<typeof GetSelfTransfer>>>(
    SELF_PENDING_TRANSFER_QUERY_KEY(transferId),
    (params) => GetSelfTransfer({ ...params, transferId }),
    {
      enabled: !!token && !!transferId,
    }
  );
};

export default useGetSelfTransfer;
