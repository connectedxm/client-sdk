import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface EventListingSpeaker {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
}

export interface AddSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: EventListingSpeaker;
}

export const AddSelfEventListingSpeaker = async ({
  eventId,
  speaker,
  clientApiParams,
  queryClient,
  locale = "en",
}: AddSelfEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/speakers`,
    {
      speaker,
    }
  );

  if (queryClient && data.status === "ok") {
    if (data.data) {
      queryClient.setQueryData(
        [...EVENT_QUERY_KEY(eventId), locale],
        (oldData: any) => {
          const event = oldData
            ? JSON.parse(JSON.stringify(oldData))
            : undefined;
          if (event && event.data) {
            if (event.data?.speakers) {
              event.data.speakers.push(data.data);
            } else {
              event.data.speakers = [data.data];
            }
          }
          return event;
        }
      );
      queryClient.setQueryData(
        [...SELF_EVENT_LISTING_QUERY_KEY(eventId), locale],
        (oldData: any) => {
          const event = oldData
            ? JSON.parse(JSON.stringify(oldData))
            : undefined;
          if (event && event.data) {
            if (event.data?.speakers) {
              event.data.speakers.push(data.data);
            } else {
              event.data.speakers = [data.data];
            }
          }
          return event;
        }
      );
    }
  }

  return data;
};

export const useAddSelfEventListingSpeaker = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventListingSpeaker>>,
      Omit<AddSelfEventListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventListingSpeakerParams,
    Awaited<ReturnType<typeof AddSelfEventListingSpeaker>>
  >(AddSelfEventListingSpeaker, params, options);
};
