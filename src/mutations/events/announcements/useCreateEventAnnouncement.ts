import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";
import { ListingAnnouncementCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventAnnouncementParams extends MutationParams {
  eventId: string;
  announcement: ListingAnnouncementCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventAnnouncement = async ({
  eventId,
  announcement,
  clientApiParams,
  queryClient,
}: CreateEventAnnouncementParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<Announcement>>(
    `/listings/${eventId}/announcements`,
    announcement
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_ANNOUNCEMENTS_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventAnnouncement = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventAnnouncement>>,
      Omit<CreateEventAnnouncementParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAnnouncementParams,
    Awaited<ReturnType<typeof CreateEventAnnouncement>>
  >(CreateEventAnnouncement, options);
};
