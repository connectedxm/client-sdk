import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { LinkPreview, ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const LINK_PREVIEW_QUERY_KEY = (href: string): QueryKey => [
  "LINK_PREVIEW",
  encodeURIComponent(href),
];

export const SET_LINK_PREVIEW_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LINK_PREVIEW_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLinkPreview>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LINK_PREVIEW_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetLinkPreviewProps extends SingleQueryParams {
  href: string;
}

export const GetLinkPreview = async ({
  href,
  clientApiParams,
}: GetLinkPreviewProps): Promise<ConnectedXMResponse<LinkPreview>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/storage/link-preview?href=${encodeURIComponent(href)}`
  );
  return data;
};

export const useGetLinkPreview = (
  href: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLinkPreview>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLinkPreview>>(
    LINK_PREVIEW_QUERY_KEY(href),
    (_params) => GetLinkPreview({ href, ..._params }),
    {
      ...options,
      enabled: !!href && (options?.enabled ?? true),
    }
  );
};
