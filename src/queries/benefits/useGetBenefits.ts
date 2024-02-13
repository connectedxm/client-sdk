import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { Benefit } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const BENEFITS_QUERY_KEY = () => ["BENEFITS"];

export const SET_BENEFITS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BENEFITS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefits>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BENEFITS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetBenefitsProps extends InfiniteQueryParams {}

export const GetBenefits = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApi,
}: GetBenefitsProps): Promise<ConnectedXMResponse<Benefit[]>> => {
  const { data } = await clientApi.get(`/benefits`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetBenefits = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetBenefits>> = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<ReturnType<typeof GetBenefits>>(
    BENEFITS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetBenefits(params),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};
