import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { ContentType } from "@interfaces";
import { CONTENT_TYPES_QUERY_KEY } from "./useGetContentTypes";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENT_TYPE_QUERY_KEY = (contentTypeId: string): QueryKey => [
  ...CONTENT_TYPES_QUERY_KEY(),
  contentTypeId,
];

export const SET_CONTENT_TYPE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentType>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENT_TYPE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetContentTypeParams extends SingleQueryParams {
  contentTypeId: string;
}

export const GetContentType = async ({
  contentTypeId,
  clientApi,
}: GetContentTypeParams): Promise<ConnectedXMResponse<ContentType>> => {
  const { data } = await clientApi.get(`/contentTypes/${contentTypeId}`);

  return data;
};

export const useGetContentType = (
  contentTypeId: string,
  options: SingleQueryOptions<ReturnType<typeof GetContentType>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentType>>(
    CONTENT_TYPE_QUERY_KEY(contentTypeId),
    (params) =>
      GetContentType({ contentTypeId: contentTypeId || "", ...params }),
    {
      ...options,
      enabled: !!contentTypeId && (options.enabled ?? true),
    }
  );
};
