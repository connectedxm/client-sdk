import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { EventListing } from "@context/interfaces";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTING } from "@context/queries/self/useGetSelfEventListing";
import { QUERY_KEY as EVENT_LISTINGS } from "@context/queries/self/useGetSelfEventListings";
import { useQueryClient } from "@tanstack/react-query";
// import GetImageBuffer from "@utilities/GetImageBuffer";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export interface UpdateListing {
  eventType: string;
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  registration: boolean;
  publicRegistrants: boolean;
  newActivityCreatorEmailNotification: boolean;
  newActivityCreatorPushNotification: boolean;
  timezone: string | null;
  meetingUrl: string | null;
  venue: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  registrationLimit: number | null;
  externalUrl: string | null;
}

interface UpdateSelfEventListingParams extends MutationParams {
  eventId: string;
  event: UpdateListing;
  base64?: any;
}

export const UpdateSelfEventListing = async ({
  eventId,
  event,
  base64,
}: UpdateSelfEventListingParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.put(`/self/events/listings/${eventId}`, {
    event,
    image: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
  });
  return data;
};

export const useUpdateSelfEventListing = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfEventListingParams>(
    (params: Omit<UpdateSelfEventListingParams, "eventId">) =>
      UpdateSelfEventListing({ eventId, ...params }),
    {
      onSuccess: (response: ConnectedXMResponse<EventListing>) => {
        queryClient.setQueryData([EVENT, eventId], response);
        queryClient.setQueryData([EVENT_LISTING, eventId], response);

        queryClient.invalidateQueries([EVENT, eventId]);
        queryClient.invalidateQueries([EVENT_LISTING, eventId]);
        queryClient.invalidateQueries([EVENT_LISTINGS]);
      },
    }
  );
};

export default useUpdateSelfEventListing;
