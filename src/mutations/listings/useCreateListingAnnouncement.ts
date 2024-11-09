import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";
import { GroupEventListingAnnouncementCreateInputs } from "@src/params";

export interface CreateListingAnnouncementParams extends MutationParams {
  eventId: string;
  listingAnnouncement: GroupEventListingAnnouncementCreateInputs;
}

export const CreateListingAnnouncement = async ({
  eventId,
  listingAnnouncement: { title, html, email, push },
  clientApiParams,
  queryClient,
}: CreateListingAnnouncementParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<Announcement>>(
    `/listings/${eventId}/announcements`,
    {
      title,
      html,
      email,
      push,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_ANNOUNCEMENTS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useCreateListingAnnouncement = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateListingAnnouncement>>,
      Omit<CreateListingAnnouncementParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateListingAnnouncementParams,
    Awaited<ReturnType<typeof CreateListingAnnouncement>>
  >(CreateListingAnnouncement, options);
};
