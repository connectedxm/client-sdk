import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Purchase } from "@context/interfaces";
import { QUERY_KEY as SELF_EVENT_SESSIONS } from "@context/queries/self/useGetSelfEventSessions";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface RemoveSelfEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const RemoveSelfEventSession = async ({
  eventId,
  sessionId,
}: RemoveSelfEventSessionParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/self/events/${eventId}/sessions/${sessionId}`,
  );
  return data;
};

export const useRemoveSelfEventSession = (
  eventId: string,
  sessionId: string,
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    () => RemoveSelfEventSession({ eventId, sessionId }),
    {
      onSuccess: (_response: ConnectedXMResponse<Purchase>) => {
        queryClient.invalidateQueries([SELF_EVENT_SESSIONS]);
      },
    },
  );
};

export default useRemoveSelfEventSession;
