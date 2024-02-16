import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface RemoveSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

export const RemoveSelfEventListingSpeaker = async ({
  eventId,
  speakerId,
}: RemoveSelfEventListingSpeakerParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/self/events/listings/${eventId}/speakers/${speakerId}`,
  );

  return data;
};

export const useRemoveSelfEventListingSpeaker = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RemoveSelfEventListingSpeakerParams>(
    (params: RemoveSelfEventListingSpeakerParams) =>
      RemoveSelfEventListingSpeaker({ ...params }),
    {
      onMutate: ({ eventId, speakerId }) => {
        queryClient.setQueryData([EVENT, eventId], (event: any) => {
          if (event && event.data) {
            const index = event?.data?.speakers?.findIndex(
              (speaker: any) => speaker.id === speakerId,
            );
            if (index !== -1 && event.data.speakers) {
              event.data.speakers.splice(index, 1);
            }
          }
          return event;
        });
        queryClient.setQueryData([EVENT_LISTING, eventId], (event: any) => {
          if (event && event.data) {
            const index = event?.data?.speakers?.findIndex(
              (speaker: any) => speaker.id === speakerId,
            );
            if (index !== -1 && event.data.speakers) {
              event.data.speakers.splice(index, 1);
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

export default useRemoveSelfEventListingSpeaker;
