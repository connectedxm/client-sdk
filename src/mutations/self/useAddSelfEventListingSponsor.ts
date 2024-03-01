import { Account, ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  EVENT_SPONSORS_QUERY_KEY,
  SET_SELF_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface AddSelfEventListingSponsorParams extends MutationParams {
  eventId: string;
  sponsor: Account;
}

export const AddSelfEventListingSponsor = async ({
  eventId,
  sponsor,
  clientApiParams,
  queryClient,
}: AddSelfEventListingSponsorParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sponsors`,
    {
      sponsorId: sponsor.id,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORS_QUERY_KEY(eventId),
    });
    SET_SELF_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

export const useAddSelfEventListingSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventListingSponsor>>,
      Omit<AddSelfEventListingSponsorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventListingSponsorParams,
    Awaited<ReturnType<typeof AddSelfEventListingSponsor>>
  >(AddSelfEventListingSponsor, options);
};
