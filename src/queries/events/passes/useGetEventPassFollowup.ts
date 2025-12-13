import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_PASS_FOLLOWUPS_QUERY_KEY } from "./useGetEventPassFollowups";

export const EVENT_PASS_FOLLOWUP_QUERY_KEY = (
  eventId: string,
  passId: string,
  followupId: string
): QueryKey => [...EVENT_PASS_FOLLOWUPS_QUERY_KEY(eventId, passId), followupId];

export const SET_EVENT_PASS_FOLLOWUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_FOLLOWUP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassFollowup>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_FOLLOWUP_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassFollowupProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  followupId: string;
}

export const GetEventPassFollowup = async ({
  eventId,
  passId,
  followupId,
  clientApiParams,
}: GetEventPassFollowupProps): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/followups/${followupId}`
  );

  return data;
};

export const useGetEventPassFollowup = (
  eventId: string,
  passId: string,
  followupId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventPassFollowup>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventPassFollowup>>(
    EVENT_PASS_FOLLOWUP_QUERY_KEY(eventId, passId, followupId),
    (params: SingleQueryParams) =>
      GetEventPassFollowup({
        eventId,
        passId,
        followupId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passId &&
        !!followupId &&
        (options?.enabled ?? true),
    }
  );
};
