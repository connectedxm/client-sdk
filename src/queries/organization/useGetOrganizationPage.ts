import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Page } from "@interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const ORGANIZATION_PAGE_QUERY_KEY = (type: PageType): QueryKey => [
  ...ORGANIZATION_QUERY_KEY(),
  "PAGE",
  type,
];

export type PageType = "about" | "team" | "privacy" | "terms";

export interface GetOrganizationPageProps extends SingleQueryParams {
  type: PageType;
}

export const GetOrganizationPage = async ({
  type,
  clientApiParams,
}: GetOrganizationPageProps): Promise<ConnectedXMResponse<Page | null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
      enabled: !!type && (options?.enabled ?? true),
    }
  );
};
