import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { BaseVideo, ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const VIDEO_QUERY_KEY = (videoId: string): QueryKey => [
  "VIDEO",
  videoId,
];

export const SET_VIDEO_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof VIDEO_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetVideo>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...VIDEO_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

export interface GetVideoProps extends SingleQueryParams {
  videoId: string;
}

export const GetVideo = async ({
  videoId,
  clientApiParams,
}: GetVideoProps): Promise<ConnectedXMResponse<BaseVideo>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/storage/videos/${videoId}`);
  return data;
};

export const useGetVideo = (
  videoId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetVideo>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetVideo>>(
    VIDEO_QUERY_KEY(videoId),
    (_params) => GetVideo({ videoId, ..._params }),
    {
      ...options,
      enabled: !!videoId && (options?.enabled ?? true),
    }
  );
};
