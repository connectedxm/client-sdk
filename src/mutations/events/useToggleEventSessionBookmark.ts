import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSIONS_QUERY_KEY } from "@src/queries/events/useGetEventSessions";
import { EVENT_SESSION_QUERY_KEY } from "@src/queries/events/useGetEventSession";

export interface ToggleEventSessionBookmarkParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

export interface ToggleEventSessionBookmarkResponse {
  bookmarked: boolean;
}

export const ToggleEventSessionBookmark = async ({
  eventId,
  sessionId,
  passId,
  clientApiParams,
  queryClient,
}: ToggleEventSessionBookmarkParams): Promise<
  ConnectedXMResponse<ToggleEventSessionBookmarkResponse>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } =
    await clientApi.post<ConnectedXMResponse<ToggleEventSessionBookmarkResponse>>(
      `/events/${eventId}/sessions/${sessionId}/bookmark`,
      {
        passId,
      }
    );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    });
  }

  return data;
};

export const useToggleEventSessionBookmark = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ToggleEventSessionBookmark>>,
      Omit<ToggleEventSessionBookmarkParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ToggleEventSessionBookmarkParams,
    Awaited<ReturnType<typeof ToggleEventSessionBookmark>>
  >(ToggleEventSessionBookmark, options);
};
