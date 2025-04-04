import {
  ConnectedXMResponse,
  EventListing,
  EventType,
  Session,
  Speaker,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  GROUP_EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  LISTINGS_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface CreateListing {
  eventType: keyof typeof EventType;
  visible: boolean;
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  timezone: string;
  // Optional fields
  venue?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  externalUrl?: string;
  meetingUrl?: string;
  registration?: boolean;
  registrationLimit?: number | null;
  groupOnly?: boolean;
}

export interface CreateListingParams extends MutationParams {
  event: CreateListing;
  imageDataUri?: any;
  groupId?: string;
  sponsorIds?: string[];
  speakers?: Speaker[];
  sessions?: Session[];
}

export const CreateListing = async ({
  event,
  imageDataUri,
  groupId,
  sponsorIds,
  speakers,
  sessions,
  clientApiParams,
  queryClient,
}: CreateListingParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings`,
    {
      event,
      image: imageDataUri ? imageDataUri : undefined,
      groupId: groupId || undefined,
      sponsorIds: sponsorIds || undefined,
      speakers,
      sessions,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(true),
    });
    if (groupId) {
      queryClient.invalidateQueries({
        queryKey: GROUP_EVENTS_QUERY_KEY(groupId),
      });
    }
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(data.data.id), clientApiParams.locale],
      data
    );
  }

  return data;
};

export const useCreateListing = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateListing>>,
      Omit<CreateListingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateListingParams,
    Awaited<ReturnType<typeof CreateListing>>
  >(CreateListing, options);
};
