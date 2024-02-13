import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { ConnectedXMResponse, Interest } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_INTERESTS_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "INTERESTS",
];

interface GetSelfInterestsProps extends InfiniteQueryParams {}

export const GetSelfInterests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApi,
}: GetSelfInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const { data } = await clientApi.get(`/self/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSelfInterests = (
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfInterests>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfInterests>>
  >(
    SELF_INTERESTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfInterests({ ...params }),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfInterests;
