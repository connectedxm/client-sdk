import {
  EVENT_SPONSORS_QUERY_KEY,
  SET_SELF_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface RemoveSelfEventListingSponsorParams extends MutationParams {
  eventId: string;
  sponsorId: string;
}

export const RemoveSelfEventListingSponsor = async ({
  eventId,
  sponsorId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventListingSponsorParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sponsors/${sponsorId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORS_QUERY_KEY(eventId),
    });
    SET_SELF_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

export const useRemoveSelfEventListingSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventListingSponsor>>,
      Omit<
        RemoveSelfEventListingSponsorParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventListingSponsorParams,
    Awaited<ReturnType<typeof RemoveSelfEventListingSponsor>>
  >(RemoveSelfEventListingSponsor, options);
};
