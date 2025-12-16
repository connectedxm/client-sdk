import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";
import { EventListingAnnouncementCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventListingAnnouncementParams extends MutationParams {
  eventId: string;
  announcement: EventListingAnnouncementCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventListingAnnouncement = async ({
  eventId,
  announcement,
  clientApiParams,
  queryClient,
}: CreateEventListingAnnouncementParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<Announcement>>(
    `/listings/${eventId}/announcements`,
    announcement
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_ANNOUNCEMENTS_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventListingAnnouncement = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventListingAnnouncement>>,
      Omit<
        CreateEventListingAnnouncementParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventListingAnnouncementParams,
    Awaited<ReturnType<typeof CreateEventListingAnnouncement>>
  >(CreateEventListingAnnouncement, options);
};
