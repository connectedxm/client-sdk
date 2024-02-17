import { Account, ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";

export interface AddSelfEventListingSponsorParams extends MutationParams {
  eventId: string;
  sponsor: Account;
}

export const AddSelfEventListingSponsor = async ({
  eventId,
  sponsor,
  clientApi,
  queryClient,
  locale = "en",
}: AddSelfEventListingSponsorParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(eventId), locale],
      (oldData: any) => {
        const event = oldData ? JSON.parse(JSON.stringify(oldData)) : undefined;
        if (event && event.data) {
          if (event.data?.sponsors) {
            event.data.sponsors.push(sponsor);
          } else {
            event.data.sponsors = [sponsor];
          }
        }
        return event;
      }
    );
    queryClient.setQueryData(
      [...SELF_EVENT_LISTING_QUERY_KEY(eventId), locale],
      (oldData: any) => {
        const event = oldData ? JSON.parse(JSON.stringify(oldData)) : undefined;
        if (event && event.data) {
          if (event.data?.sponsors) {
            event.data.sponsors.push(sponsor);
          } else {
            event.data.sponsors = [sponsor];
          }
        }
        return event;
      }
    );
  }

  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sponsors`,
    {
      sponsorId: sponsor.id,
    }
  );

  return data;
};

export const useAddSelfEventListingSponsor = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options?: MutationOptions<
    Awaited<ReturnType<typeof AddSelfEventListingSponsor>>,
    AddSelfEventListingSponsorParams
  >
) => {
  return useConnectedMutation<
    AddSelfEventListingSponsorParams,
    Awaited<ReturnType<typeof AddSelfEventListingSponsor>>
  >(AddSelfEventListingSponsor, params, options);
};
