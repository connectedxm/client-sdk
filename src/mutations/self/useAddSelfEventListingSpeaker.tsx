import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface EventListingSpeaker {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
}

interface AddSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: EventListingSpeaker;
}

export const AddSelfEventListingSpeaker = async ({
  eventId,
  speaker,
}: AddSelfEventListingSpeakerParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/self/events/listings/${eventId}/speakers`,
    {
      speaker,
    }
  );

  return data;
};

export const useAddSelfEventListingSpeaker = (listingId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<AddSelfEventListingSpeakerParams>(
    (params: AddSelfEventListingSpeakerParams) =>
      AddSelfEventListingSpeaker({ ...params }),
    {
      onSuccess: (response) => {
        if (response.data) {
          queryClient.setQueryData([EVENT, listingId], (oldData: any) => {
            const event = oldData
              ? JSON.parse(JSON.stringify(oldData))
              : undefined;
            if (event && event.data) {
              if (event.data?.speakers) {
                event.data.speakers.push(response.data);
              } else {
                event.data.speakers = [response.data];
              }
            }
            return event;
          });
          queryClient.setQueryData(
            [EVENT_LISTING, listingId],
            (oldData: any) => {
              const event = oldData
                ? JSON.parse(JSON.stringify(oldData))
                : undefined;
              if (event && event.data) {
                if (event.data?.speakers) {
                  event.data.speakers.push(response.data);
                } else {
                  event.data.speakers = [response.data];
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

export default useAddSelfEventListingSpeaker;
