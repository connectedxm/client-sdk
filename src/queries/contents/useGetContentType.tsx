import { ClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { ContentType } from "@interfaces";
import { CONTENT_TYPES_QUERY_KEY } from "./useGetContentTypes";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENT_TYPE_QUERY_KEY = (contentTypeId: string) => [
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

interface GetContentTypeParams extends SingleQueryParams {
  contentTypeId: string;
}

export const GetContentType = async ({
  contentTypeId,
  locale,
}: GetContentTypeParams): Promise<ConnectedXMResponse<ContentType>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/contentTypes/${contentTypeId}`);

  return data;
};

const useGetContentType = (
  contentTypeId: string,
  params: SingleQueryParams = {},
  options: SingleQueryOptions<ReturnType<typeof GetContentType>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentType>>(
    CONTENT_TYPE_QUERY_KEY(contentTypeId),
    (params) =>
      GetContentType({ contentTypeId: contentTypeId || "", ...params }),
    params,
    {
      ...options,
      enabled: !!contentTypeId && (options.enabled ?? true),
    }
  );
};

export default useGetContentType;
