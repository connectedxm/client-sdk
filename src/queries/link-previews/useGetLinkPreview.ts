import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { LinkPreview, ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const LINK_PREVIEW_QUERY_KEY = (url: string): QueryKey => [
  "LINK_PREVIEW",
  encodeURIComponent(url),
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
  url: string;
}

export const GetLinkPreview = async ({
  url,
  clientApiParams,
}: GetLinkPreviewProps): Promise<ConnectedXMResponse<LinkPreview | null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/storage/link-preview?href=${encodeURIComponent(url)}`
  );
  return data;
};

export const useGetLinkPreview = (
  url: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLinkPreview>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLinkPreview>>(
    LINK_PREVIEW_QUERY_KEY(url),
    (_params) => GetLinkPreview({ url, ..._params }),
    {
      ...options,
      enabled: !!url && (options?.enabled ?? true),
    }
  );
};
