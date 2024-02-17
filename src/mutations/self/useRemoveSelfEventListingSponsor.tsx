import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";

export interface RemoveSelfEventListingSponsorParams extends MutationParams {
  eventId: string;
  sponsorId: string;
}

export const RemoveSelfEventListingSponsor = async ({
  eventId,
  sponsorId,
  clientApi,
  queryClient,
  locale = "en",
}: RemoveSelfEventListingSponsorParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(eventId), locale],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.sponsors?.findIndex(
            (sponsor: any) => sponsor.id === sponsorId
          );
          if (index !== -1 && event.data.sponsors) {
            event.data.sponsors.splice(index, 1);
          }
        }
        return event;
      }
    );
    queryClient.setQueryData(
      [...SELF_EVENT_LISTING_QUERY_KEY(eventId), locale],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.sponsors?.findIndex(
            (sponsor: any) => sponsor.id === sponsorId
          );
          if (index !== -1 && event.data.sponsors) {
            event.data.sponsors.splice(index, 1);
          }
        }
        return event;
      }
    );
  }

  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sponsors/${sponsorId}`
  );

  return data;
};

export const useRemoveSelfEventListingSponsor = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveSelfEventListingSponsor>>,
    RemoveSelfEventListingSponsorParams
  >
) => {
  return useConnectedMutation<
    RemoveSelfEventListingSponsorParams,
    Awaited<ReturnType<typeof RemoveSelfEventListingSponsor>>
  >(RemoveSelfEventListingSponsor, params, options);
};
