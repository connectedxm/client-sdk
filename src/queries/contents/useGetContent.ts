import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { Content } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CONTENTS_QUERY_KEY } from "./useGetContents";

export const CONTENT_QUERY_KEY = (contentId: string): QueryKey => [
  ...CONTENTS_QUERY_KEY(),
  contentId,
];

export const SET_CONTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContent>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetContentParams extends SingleQueryParams {
  contentId: string;
}

export const GetContent = async ({
  contentId,
  clientApiParams,
}: GetContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/contents/${contentId}`);

  return data;
};

export const useGetContent = (
  contentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetContent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContent>>(
    CONTENT_QUERY_KEY(contentId),
    (params: SingleQueryParams) => GetContent({ contentId, ...params }),
    {
      ...options,
      enabled: !!contentId && options.enabled,
    }
  );
};
