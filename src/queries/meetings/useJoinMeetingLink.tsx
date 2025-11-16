import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const JOIN_MEETING_LINK_QUERY_KEY = (
  meetingId: string,
  code: string
): QueryKey => ["JOIN_MEETING_LINK", meetingId, code];

export const SET_JOIN_MEETING_LINK_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof JOIN_MEETING_LINK_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetJoinMeetingLink>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...JOIN_MEETING_LINK_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetJoinMeetingLinkProps extends SingleQueryParams {
  meetingId: string;
  code: string;
}

export const GetJoinMeetingLink = async ({
  meetingId,
  code,
  clientApiParams,
}: GetJoinMeetingLinkProps): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/meetings/${meetingId}`, {
    params: {
      code,
    },
  });
  return data;
};

export const useJoinMeetingLink = (
  meetingId: string = "",
  code: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetJoinMeetingLink>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetJoinMeetingLink>>(
    JOIN_MEETING_LINK_QUERY_KEY(meetingId, code),
    (_params) => GetJoinMeetingLink({ meetingId, code, ..._params }),
    {
      ...options,
      enabled: !!meetingId && !!code && (options?.enabled ?? true),
    }
  );
};
