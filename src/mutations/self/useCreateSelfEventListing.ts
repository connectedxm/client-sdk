import {
  ConnectedXMResponse,
  EventListing,
  EventType,
  Session,
  Speaker,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  COMMUNITY_EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  SELF_EVENT_LISTINGS_QUERY_KEY,
} from "@src/queries";

export interface CreateEventListing {
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  eventType: keyof typeof EventType;
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

export interface CreateSelfEventListingParams extends MutationParams {
  event: CreateEventListing;
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
  clientApi,
  queryClient,
  locale = "en",
}: CreateSelfEventListingParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  let data;
  if (communityId) {
    data = (
      await clientApi.post<ConnectedXMResponse<EventListing>>(
        `/communityModerator/${communityId}/events`,
        {
          event,
          image: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
          communityId: communityId || undefined,
          sponsorIds: sponsorIds || undefined,
          speakers,
          sessions,
        }
      )
    ).data;
  } else {
    data = (
      await clientApi.post<ConnectedXMResponse<EventListing>>(
        `/self/events/listings`,
        {
          event,
          image: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
          sponsorIds: sponsorIds || undefined,
          speakers,
          sessions,
        }
      )
    ).data;
  }

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(true),
    });
    if (communityId) {
      queryClient.invalidateQueries({
        queryKey: COMMUNITY_EVENTS_QUERY_KEY(communityId),
      });
    }
    queryClient.setQueryData([...EVENT_QUERY_KEY(data.data.id), locale], data);
  }

  return data;
};

export const useCreateSelfEventListing = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfEventListing>>,
      Omit<CreateSelfEventListingParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfEventListingParams,
    Awaited<ReturnType<typeof CreateSelfEventListing>>
  >(CreateSelfEventListing, params, options);
};
