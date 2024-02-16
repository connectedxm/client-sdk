import { ConnectedXM } from "@context/api/ConnectedXM";
import { Session } from "@context/interfaces";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface AddSelfEventListingSessionParams extends MutationParams {
  eventId: string;
  session: Omit<
    Session,
    | "id"
    | "slug"
    | "event"
    | "sortOrder"
    | "tracks"
    | "nonSession"
    | "createdAt"
    | "updatedAt"
    | "speakers"
    | "sponsors"
    | "longDescription"
    | "image"
    | "streamInput"
  >;
}

export const AddSelfEventListingSession = async ({
  eventId,
  session,
}: AddSelfEventListingSessionParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/self/events/listings/${eventId}/sessions`,
    {
      session,
    }
  );

  return data;
};

export const useAddSelfEventListingSession = (listingId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<AddSelfEventListingSessionParams>(
    (params: AddSelfEventListingSessionParams) =>
      AddSelfEventListingSession({ ...params }),
    {
      onSuccess: (response) => {
        if (response.data && !!listingId) {
          queryClient.setQueryData([EVENT, listingId], (oldData: any) => {
            const event = oldData
              ? JSON.parse(JSON.stringify(oldData))
              : undefined;
            if (event && event.data) {
              if (event.data?.sessions) {
                event.data.sessions.push(response.data);
              } else {
                event.data.sessions = [response.data];
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
                if (event.data?.sessions) {
                  event.data.sessions.push(response.data);
                } else {
                  event.data.sessions = [response.data];
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

export default useAddSelfEventListingSession;
