import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  EVENT_QUERY_KEY,
  SELF_EVENT_LISTINGS_QUERY_KEY,
  SELF_EVENT_LISTING_QUERY_KEY,
  SET_EVENT_QUERY_DATA,
  SET_SELF_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";

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

export interface UpdateSelfEventListingParams extends MutationParams {
  eventId: string;
  event: UpdateListing;
  base64?: any;
}

export const UpdateSelfEventListing = async ({
  eventId,
  event,
  base64,
  clientApi,
  queryClient,
  locale = "en",
}: UpdateSelfEventListingParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}`,
    {
      event,
      image: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_QUERY_DATA(queryClient, [eventId], data, [locale]);
    SET_SELF_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data, [locale]);

    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTING_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(true),
    });
  }

  return data;
};

export const useUpdateSelfEventListing = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateSelfEventListing>>,
    UpdateSelfEventListingParams
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventListingParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateSelfEventListing, params, options);
};
