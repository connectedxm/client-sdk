import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { Transfer } from "@interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_TRANSFERS_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "TRANSFERS",
];

interface GetSelfTransfersProps extends InfiniteQueryParams {}

export const GetSelfTransfers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetSelfTransfersProps): Promise<ConnectedXMResponse<Transfer[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/transfers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSelfTransfers = () => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfTransfers>>
  >(
    SELF_TRANSFERS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfTransfers({ ...params }),
    {
      enabled: !!token,
    }
  );
};

export default useGetSelfTransfers;
