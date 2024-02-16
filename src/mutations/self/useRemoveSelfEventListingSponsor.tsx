import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface RemoveSelfEventListingSponsorParams extends MutationParams {
  eventId: string;
  sponsorId: string;
}

export const RemoveSelfEventListingSponsor = async ({
  eventId,
  sponsorId,
}: RemoveSelfEventListingSponsorParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/self/events/listings/${eventId}/sponsors/${sponsorId}`,
  );

  return data;
};

export const useRemoveSelfEventListingSponsor = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RemoveSelfEventListingSponsorParams>(
    (params: RemoveSelfEventListingSponsorParams) =>
      RemoveSelfEventListingSponsor({ ...params }),
    {
      onMutate: ({ eventId, sponsorId }) => {
        queryClient.setQueryData([EVENT, eventId], (event: any) => {
          if (event && event.data) {
            const index = event?.data?.sponsors?.findIndex(
              (sponsor: any) => sponsor.id === sponsorId,
            );
            if (index !== -1 && event.data.sponsors) {
              event.data.sponsors.splice(index, 1);
            }
          }
          return event;
        });
        queryClient.setQueryData([EVENT_LISTING, eventId], (event: any) => {
          if (event && event.data) {
            const index = event?.data?.sponsors?.findIndex(
              (sponsor: any) => sponsor.id === sponsorId,
            );
            if (index !== -1 && event.data.sponsors) {
              event.data.sponsors.splice(index, 1);
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

export default useRemoveSelfEventListingSponsor;
