import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import type { Channel, Content } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface ContentsExploreData {
  featuredChannels: Channel[];
  featuredContents: Content[];
  upcomingContents: Content[];
  pastContents: Content[];
}

export const CONTENTS_EXPLORE_QUERY_KEY = (): QueryKey => ["CONTENTS_EXPLORE"];

export const SET_CONTENTS_EXPLORE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENTS_EXPLORE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentsExplore>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENTS_EXPLORE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetContentsExploreProps extends SingleQueryParams {}

export const GetContentsExplore = async ({
  clientApiParams,
}: GetContentsExploreProps): Promise<
  ConnectedXMResponse<ContentsExploreData>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/contents/explore`);
  return data;
};

export const useGetContentsExplore = (
  options: SingleQueryOptions<ReturnType<typeof GetContentsExplore>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentsExplore>>(
    CONTENTS_EXPLORE_QUERY_KEY(),
    (params) => GetContentsExplore({ ...params }),
    options
  );
};
