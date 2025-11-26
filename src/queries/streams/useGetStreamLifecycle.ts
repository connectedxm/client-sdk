import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { QueryClient, QueryKey } from "@tanstack/react-query";
import axios from "axios";

export type StreamLifecycleStatus = "disconnected" | "ready" | "ended";

export interface StreamLifecycle {
  isInput: boolean;
  videoUID: string | null;
  live: boolean;
  status: StreamLifecycleStatus;
  chunked: boolean;
  unstable: {
    ltxEnabled: boolean;
  };
}

export const STREAM_LIFECYCLE_QUERY_KEY = (cloudflareId: string): QueryKey => [
  "STREAM_LIFECYCLE",
  cloudflareId,
];

export const SET_STREAM_LIFECYCLE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_LIFECYCLE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamLifecycle>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...STREAM_LIFECYCLE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetStreamLifecycleProps extends SingleQueryParams {
  cloudflareId: string;
  cloudflareStreamDomain: string;
}

export const GetStreamLifecycle = async ({
  cloudflareId,
  cloudflareStreamDomain,
}: GetStreamLifecycleProps): Promise<StreamLifecycle | null> => {
  const { data } = await axios.get<StreamLifecycle>(
    `https://${cloudflareStreamDomain}/${cloudflareId}/lifecycle`
  );
  return data;
};

export const useGetStreamLifecycle = (
  cloudflareId: string = "",
  cloudflareStreamDomain: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetStreamLifecycle>> = {}
) => {
  const query = useConnectedSingleQuery<ReturnType<typeof GetStreamLifecycle>>(
    STREAM_LIFECYCLE_QUERY_KEY(cloudflareId),
    (params) =>
      GetStreamLifecycle({ cloudflareId, cloudflareStreamDomain, ...params }),
    {
      staleTime: 0, // Always consider data stale to ensure refetch
      refetchOnWindowFocus: true,
      // Dynamic refetch interval based on stream status
      refetchInterval: (query) => {
        const data = query.state.data as StreamLifecycle | null | undefined;
        if (!data) return 5000; // No data yet, poll frequently
        if (data.live) return 30000; // Stream is live, poll less frequently
        return 5000; // Stream disconnected/ended, poll frequently for restart
      },
      ...options,
      enabled:
        !!cloudflareId &&
        !!cloudflareStreamDomain &&
        (options?.enabled ?? true),
    }
  );

  return {
    ...query,
    isLive: query.data?.live ?? false,
    status: query.data?.status ?? "disconnected",
    videoUID: query.data?.videoUID ?? null,
  };
};
