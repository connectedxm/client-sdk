import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Purchase } from "@context/interfaces";
import { QUERY_KEY as SELF_EVENT_SESSIONS } from "@context/queries/self/useGetSelfEventSessions";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface AddSelfEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const AddSelfEventSession = async ({
  eventId,
  sessionId,
}: AddSelfEventSessionParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/events/${eventId}/sessions/${sessionId}`
  );
  return data;
};

export const useAddSelfEventSession = (eventId: string, sessionId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    () => AddSelfEventSession({ eventId, sessionId }),
    {
      onSuccess: (_response: ConnectedXMResponse<Purchase>) => {
        queryClient.invalidateQueries([SELF_EVENT_SESSIONS]);
      },
    }
  );
};

export default useAddSelfEventSession;
