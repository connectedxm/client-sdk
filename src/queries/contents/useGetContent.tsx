import { ClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { Content } from "@interfaces";
import { CONTENTS_QUERY_KEY } from "./useGetContents";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENT_QUERY_KEY = (contentId: string) => [
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

interface GetContentParams extends SingleQueryParams {
  contentId: string;
}

export const GetContent = async ({
  contentId,
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/contents/${contentId}`);

  return data;
};

const useGetContent = (
  contentId: string,
  params: SingleQueryParams = {},
  options: SingleQueryOptions<ReturnType<typeof GetContent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContent>>(
    CONTENT_QUERY_KEY(contentId),
    (params: SingleQueryParams) =>
      GetContent({ contentId: contentId || "", ...params }),
    params,
    {
      ...options,
      enabled: !!contentId && options.enabled,
    }
  );
};

export default useGetContent;
