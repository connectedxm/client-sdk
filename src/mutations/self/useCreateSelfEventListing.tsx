import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Speaker, Session, EventListing } from "@context/interfaces";
import { QUERY_KEY as COMMUNITY_EVENTS } from "@context/queries/communities/useGetCommunityEvents";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_LISTINGS } from "@context/queries/self/useGetSelfEventListings";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";
// import GetImageBuffer from "@utilities/GetImageBuffer";

export type EventType = "physical" | "virtual" | "hybrid";
export interface CreateEvent {
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  eventType: EventType;
  venue?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  externalUrl?: string;
  meetingUrl?: string;
  registration?: boolean;
  registrationLimit?: string;
}

interface CreateSelfEventListingParams extends MutationParams {
  event: CreateEvent;
  base64?: any;
  communityId?: string;
  sponsorIds?: string[];
  speakers?: Speaker[];
  sessions?: Session[];
}

export const CreateSelfEventListing = async ({
  event,
  base64,
  communityId,
  sponsorIds,
  speakers,
  sessions,
}: CreateSelfEventListingParams) => {
  const connectedXM = await ConnectedXM();

  // if (image) {
  //   image = await GetImageBuffer(image);
  // }

  if (communityId) {
    const { data } = await connectedXM.post(
      `/communityModerator/${communityId}/events`,
      {
        event,
        image: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
        communityId: communityId || undefined,
        sponsorIds: sponsorIds || undefined,
        speakers,
        sessions,
      }
    );
    return data;
  } else {
    const { data } = await connectedXM.post(`/self/events/listings`, {
      event,
      image: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
      sponsorIds: sponsorIds || undefined,
      speakers,
      sessions,
    });
    return data;
  }
};

export const useCreateSelfEventListing = (communityId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<CreateSelfEventListingParams>(
    (params: CreateSelfEventListingParams) =>
      CreateSelfEventListing({ ...params }),
    {
      onSuccess: (response: ConnectedXMResponse<EventListing>) => {
        queryClient.invalidateQueries([EVENT_LISTINGS]);
        if (communityId) {
          queryClient.invalidateQueries([COMMUNITY_EVENTS, communityId]);
        }
        queryClient.setQueryData([EVENT, response.data.slug], response.data);
      },
    }
  );
};

export default useCreateSelfEventListing;
