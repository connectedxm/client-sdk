import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SET_SELF_EVENT_ATTENDEE_PASS_QUERY_DATA } from "@src/queries";

export interface BookmarkEventAttendeePassSessionParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

export const BookmarkEventAttendeePassSession = async ({
  eventId,
  passId,
  sessionId,
  clientApiParams,
  queryClient,
}: BookmarkEventAttendeePassSessionParams): Promise<
  ConnectedXMResponse<Pass>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Pass>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/bookmark`
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_ATTENDEE_PASS_QUERY_DATA(
      queryClient,
      [eventId, passId],
      data,
      [clientApiParams.locale]
    );
  }

  return data;
};

export const useBookmarkEventAttendeePassSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof BookmarkEventAttendeePassSession>>,
      Omit<
        BookmarkEventAttendeePassSessionParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    BookmarkEventAttendeePassSessionParams,
    Awaited<ReturnType<typeof BookmarkEventAttendeePassSession>>
  >(BookmarkEventAttendeePassSession, options);
};
