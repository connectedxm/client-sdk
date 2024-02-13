import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { ConnectedXMResponse, Transfer } from "@interfaces";
import {
  InfiniteQueryOptions,
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
  clientApi,
}: GetSelfTransfersProps): Promise<ConnectedXMResponse<Transfer[]>> => {
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

const useGetSelfTransfers = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetSelfTransfers>> = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<ReturnType<typeof GetSelfTransfers>>(
    SELF_TRANSFERS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfTransfers({ ...params }),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfTransfers;
