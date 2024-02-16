import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface RemoveSelfEventListingSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const RemoveSelfEventListingSession = async ({
  eventId,
  sessionId,
}: RemoveSelfEventListingSessionParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/self/events/listings/${eventId}/sessions/${sessionId}`,
  );

  return data;
};

export const useRemoveSelfEventListingSession = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RemoveSelfEventListingSessionParams>(
    (params: RemoveSelfEventListingSessionParams) =>
      RemoveSelfEventListingSession({ ...params }),
    {
      onMutate: ({ eventId, sessionId }) => {
        queryClient.setQueryData([EVENT, eventId], (event: any) => {
          if (event && event.data) {
            const index = event?.data?.sessions?.findIndex(
              (session: any) => session.id === sessionId,
            );
            if (index !== -1 && event.data.sessions) {
              event.data.sessions.splice(index, 1);
            }
          }
          return event;
        });
        queryClient.setQueryData([EVENT_LISTING, eventId], (event: any) => {
          if (event && event.data) {
            const index = event?.data?.sessions?.findIndex(
              (session: any) => session.id === sessionId,
            );
            if (index !== -1 && event.data.sessions) {
              event.data.sessions.splice(index, 1);
            }
          }
          return event;
        });
      },
    },
    undefined,
    true,
  );
};

export default useRemoveSelfEventListingSession;
