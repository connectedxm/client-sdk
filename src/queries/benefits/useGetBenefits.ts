import { Benefit } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const BENEFITS_QUERY_KEY = (): QueryKey => ["BENEFITS"];

export interface GetBenefitsProps extends InfiniteQueryParams {}

export const GetBenefits = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetBenefitsProps): Promise<ConnectedXMResponse<Benefit[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetBenefits>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBenefits>>>(
    BENEFITS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetBenefits(params),
    params,
    {
      ...options,
    }
  );
};
