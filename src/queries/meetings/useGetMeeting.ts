import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { Meeting, ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const MEETING_QUERY_KEY = (meetingId: string): QueryKey => [
  "MEETINGS",
  meetingId,
];

export const SET_MEETING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeeting>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...MEETING_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetMeetingProps extends SingleQueryParams {
  meetingId: string;
}

export const GetMeeting = async ({
  meetingId,
  clientApiParams,
}: GetMeetingProps): Promise<ConnectedXMResponse<Meeting>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/meetings/${meetingId}`);
  return data;
};

export const useGetMeeting = (
  meetingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeeting>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeeting>>(
    MEETING_QUERY_KEY(meetingId),
    (_params) => GetMeeting({ meetingId, ..._params }),
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};
