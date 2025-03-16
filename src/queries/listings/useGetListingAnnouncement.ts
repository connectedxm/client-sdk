import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import type { Announcement } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ANNOUNCEMENTS_QUERY_KEY } from "./useGetListingAnnouncements";

export const LISTING_ANNOUNCEMENT_QUERY_KEY = (
  eventId: string,
  announcementId: string
): QueryKey => [LISTING_ANNOUNCEMENTS_QUERY_KEY(eventId), announcementId];

export interface GetSelfEventListingAnnouncementProps
  extends SingleQueryParams {
  eventId: string;
  announcementId: string;
}

export const GetSelfEventListingAnnouncement = async ({
  eventId,
  announcementId,
  clientApiParams,
}: GetSelfEventListingAnnouncementProps): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/announcements/${announcementId}`
  );
  return data;
};

export const useGetSelfEventListingAnnouncement = (
  eventId: string = "",
  announcementId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventListingAnnouncement>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventListingAnnouncement>
  >(
    LISTING_ANNOUNCEMENT_QUERY_KEY(eventId, announcementId),
    (params) =>
      GetSelfEventListingAnnouncement({ eventId, announcementId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!announcementId,
    }
  );
};
