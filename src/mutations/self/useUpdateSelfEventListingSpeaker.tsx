import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";
// import GetImageBuffer from "@utilities/GetImageBuffer";

interface UpdateSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: any;
  speakerId: string;
  imageBlob?: Blob;
}

export const UpdateSelfEventListingSpeaker = async ({
  eventId,
  speaker,
  speakerId,
}: UpdateSelfEventListingSpeakerParams) => {
  const connectedXM = await ConnectedXM();

  let buffer;
  // if (imageBlob) {
  //   buffer = await GetImageBuffer(imageBlob);
  // }

  const { data } = await connectedXM.put(
    `/self/events/listings/${eventId}/speakers/${speakerId}`,
    {
      speaker,
      buffer: buffer || undefined,
    }
  );

  return data;
};

export const useUpdateSelfEventListingSpeaker = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfEventListingSpeakerParams>(
    (params: UpdateSelfEventListingSpeakerParams) =>
      UpdateSelfEventListingSpeaker({ ...params }),
    {
      onSuccess: (response) => {
        if (response.data) {
          queryClient.setQueryData(
            [EVENT, response.data.event.slug],
            (event: any) => {
              if (event && event.data) {
                const index = event?.data?.speakers?.findIndex(
                  (speaker: any) => speaker.id === response.data.id
                );
                if (index !== -1 && event.data.speakers) {
                  event.data.speakers[index] = response.data;
                }
              }

              return event;
            }
          );
          queryClient.setQueryData(
            [EVENT_LISTING, response.data.event.slug],
            (event: any) => {
              if (event && event.data) {
                const index = event?.data?.speakers?.findIndex(
                  (speaker: any) => speaker.id === response.data.id
                );
                if (index !== -1 && event.data.speakers) {
                  event.data.speakers[index] = response.data;
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

export default useUpdateSelfEventListingSpeaker;
