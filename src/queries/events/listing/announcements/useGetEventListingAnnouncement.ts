import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import type { Announcement } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";

export const EVENT_LISTING_ANNOUNCEMENT_QUERY_KEY = (
  eventId: string,
  announcementId: string
): QueryKey => [EVENT_LISTING_ANNOUNCEMENTS_QUERY_KEY(eventId), announcementId];

export const SET_EVENT_LISTING_ANNOUNCEMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_LISTING_ANNOUNCEMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventListingAnnouncement>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_LISTING_ANNOUNCEMENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventListingAnnouncementProps extends SingleQueryParams {
  eventId: string;
  announcementId: string;
}

export const GetEventListingAnnouncement = async ({
  eventId,
  announcementId,
  clientApiParams,
}: GetEventListingAnnouncementProps): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/announcements/${announcementId}`
  );
  return data;
};

export const useGetEventListingAnnouncement = (
  eventId: string = "",
  announcementId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventListingAnnouncement>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventListingAnnouncement>
  >(
    EVENT_LISTING_ANNOUNCEMENT_QUERY_KEY(eventId, announcementId),
    (params) =>
      GetEventListingAnnouncement({ eventId, announcementId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!announcementId,
    }
  );
};
