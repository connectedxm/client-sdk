import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { StreamInput } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const STREAM_QUERY_KEY = (streamId: string): QueryKey => [
  "STREAMS",
  streamId,
];

export const SET_STREAM_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStream>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...STREAM_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

export interface GetStreamProps extends SingleQueryParams {
  streamId: string;
}

export const GetStream = async ({
  streamId,
  clientApiParams,
}: GetStreamProps): Promise<ConnectedXMResponse<StreamInput>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/streams/${streamId}`);
  return data;
};

export const useGetStream = (
  streamId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetStream>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStream>>(
    STREAM_QUERY_KEY(streamId),
    (params) => GetStream({ streamId: streamId || "", ...params }),
    {
      ...options,
      enabled: !!streamId && (options?.enabled ?? true),
    }
  );
};
