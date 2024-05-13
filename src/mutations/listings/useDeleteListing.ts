import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  LISTINGS_QUERY_KEY,
  LISTING_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteListingParams extends MutationParams {
  eventId: string;
}

export const DeleteListing = async ({
  eventId,
  clientApiParams,
  queryClient,
}: DeleteListingParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/listings/${eventId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENTS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: EVENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(false),
    });
    queryClient.removeQueries({
      queryKey: LISTING_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useDeleteListing = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteListing>>,
      Omit<DeleteListingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteListingParams,
    Awaited<ReturnType<typeof DeleteListing>>
  >(DeleteListing, options);
};
