import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Page } from "@interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient, QueryKey } from "@tanstack/react-query";

export const ORGANIZATION_PAGE_QUERY_KEY = (type: PageType): QueryKey => [
  ...ORGANIZATION_QUERY_KEY(),
  "PAGE",
  type,
];

export const SET_ORGANIZATION_PAGE_QUERY_DATA = (
  queryClient: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPage>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  queryClient.setQueryData(
    [
      ...ORGANIZATION_PAGE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export type PageType = "about" | "team" | "privacy" | "terms";

interface GetOrganizationPageProps extends SingleQueryParams {
  type: PageType;
}

export const GetOrganizationPage = async ({
  type,
  clientApi,
}: GetOrganizationPageProps): Promise<ConnectedXMResponse<Page>> => {
  const { data } = await clientApi.get(`/organization/pages/${type}`);
  return data;
};

export const useGetOrganizationPage = (
  type: PageType,
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationPage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationPage>>(
    ORGANIZATION_PAGE_QUERY_KEY(type),
    (params) => GetOrganizationPage({ type, ...params }),
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    }
  );
};
