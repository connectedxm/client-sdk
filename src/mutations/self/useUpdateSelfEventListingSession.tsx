import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UpdateSelfEventListingSessionParams extends MutationParams {
  eventId: string;
  session: any;
  sessionId: string;
}

export const UpdateSelfEventListingSession = async ({
  eventId,
  session,
  sessionId,
}: UpdateSelfEventListingSessionParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.put(
    `/self/events/listings/${eventId}/sessions/${sessionId}`,
    {
      session,
    }
  );

  return data;
};

export const useUpdateSelfEventListingSession = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfEventListingSessionParams>(
    (params: UpdateSelfEventListingSessionParams) =>
      UpdateSelfEventListingSession({ ...params }),
    {
      onSuccess: (response) => {
        if (response.data) {
          queryClient.setQueryData(
            [EVENT, response.data?.event?.slug],
            (event: any) => {
              if (event && event.data) {
                const index = event?.data?.sessions?.findIndex(
                  (session: any) => session.id === response.data.id
                );
                if (index !== -1 && event.data.sessions) {
                  event.data.sessions[index] = response.data;
                }
              }
              return event;
            }
          );
          queryClient.setQueryData(
            [EVENT_LISTING, response.data?.event?.slug],
            (event: any) => {
              if (event && event.data) {
                const index = event?.data?.sessions?.findIndex(
                  (session: any) => session.id === response.data.id
                );
                if (index !== -1 && event.data.sessions) {
                  event.data.sessions[index] = response.data;
                }
              }
              return event;
            }
          );
        }
      },
    },
    undefined,
    true
  );
};

export default useUpdateSelfEventListingSession;
