import { ConnectedXM } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export interface AddSelfEventListingSponsorParams extends MutationParams {
  eventId: string;
  sponsor: Account;
}

export const AddSelfEventListingSponsor = async ({
  eventId,
  sponsor,
}: AddSelfEventListingSponsorParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/self/events/listings/${eventId}/sponsors`,
    {
      sponsorId: sponsor.id,
    }
  );

  return data;
};

export const useAddSelfEventListingSponsor = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<AddSelfEventListingSponsorParams>(
    (params: AddSelfEventListingSponsorParams) =>
      AddSelfEventListingSponsor({ ...params }),
    {
      onMutate: ({ eventId, sponsor }) => {
        queryClient.setQueryData([EVENT, eventId], (oldData: any) => {
          const event = oldData
            ? JSON.parse(JSON.stringify(oldData))
            : undefined;
          if (event && event.data) {
            if (event.data?.sponsors) {
              event.data.sponsors.push(sponsor);
            } else {
              event.data.sponsors = [sponsor];
            }
          }
          return event;
        });
        queryClient.setQueryData([EVENT_LISTING, eventId], (oldData: any) => {
          const event = oldData
            ? JSON.parse(JSON.stringify(oldData))
            : undefined;
          if (event && event.data) {
            if (event.data?.sponsors) {
              event.data.sponsors.push(sponsor);
            } else {
              event.data.sponsors = [sponsor];
            }
          }
          return event;
        });
      },
    },
    undefined,
    true
  );
};

export default useAddSelfEventListingSponsor;
