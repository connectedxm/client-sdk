import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { StreamInput } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export enum StreamOutput {
  event = "event",
  group = "group",
}

export const STREAM_QUERY_KEY = (
  streamId: string,
  output: keyof typeof StreamOutput
): QueryKey => ["STREAMS", streamId, output];

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
  output: keyof typeof StreamOutput;
}

export const GetStream = async ({
  streamId,
  output,
  clientApiParams,
}: GetStreamProps): Promise<ConnectedXMResponse<StreamInput>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/streams/${streamId}`, {
    params: {
      output,
    },
  });
  return data;
};

export const useGetStream = (
  streamId: string = "",
  output: keyof typeof StreamOutput = "event",
  options: SingleQueryOptions<ReturnType<typeof GetStream>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStream>>(
    STREAM_QUERY_KEY(streamId, output),
    (params) => GetStream({ streamId: streamId || "", output, ...params }),
    {
      ...options,
      enabled: !!streamId && (options?.enabled ?? true),
    }
  );
};
