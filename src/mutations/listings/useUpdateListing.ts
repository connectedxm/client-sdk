import { ConnectedXMResponse, EventListing, EventType } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  SET_LISTING_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { GroupEventListingUpdateInputs } from "@src/params";

export interface UpdateListingParams extends MutationParams {
  eventId: string;
  event: GroupEventListingUpdateInputs;
  base64?: any;
}

export const UpdateListing = async ({
  eventId,
  event,
  base64,
  clientApiParams,
  queryClient,
}: UpdateListingParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}`,
    {
      event,
      image: base64 ?? undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
  }

  return data;
};

export const useUpdateListing = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateListing>>,
      Omit<UpdateListingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateListingParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateListing, options);
};
