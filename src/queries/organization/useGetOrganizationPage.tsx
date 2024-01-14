import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import type { ConnectedXMResponse, Page } from "@interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_PAGE_QUERY_KEY = (type: PageType) => [
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
  locale,
}: GetOrganizationPageProps): Promise<ConnectedXMResponse<Page>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/organization/pages/${type}`);
  return data;
};

const useGetOrganizationPage = (
  type: PageType,
  params: SingleQueryParams = {},
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationPage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationPage>>(
    ORGANIZATION_PAGE_QUERY_KEY(type),
    (params) => GetOrganizationPage({ type, ...params }),
    params,
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    }
  );
};

export default useGetOrganizationPage;
