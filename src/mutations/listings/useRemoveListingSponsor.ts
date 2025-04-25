import { EVENT_SPONSORS_QUERY_KEY, LISTING_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface RemoveListingSponsorParams extends MutationParams {
  eventId: string;
  sponsorId: string;
}

export const RemoveListingSponsor = async ({
  eventId,
  sponsorId,
  clientApiParams,
  queryClient,
}: RemoveListingSponsorParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sponsors/${sponsorId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORS_QUERY_KEY(eventId),
    });
    SetSingleQueryData(
      queryClient,
      LISTING_QUERY_KEY(eventId),
      clientApiParams.locale,
      data
    );
  }

  return data;
};

export const useRemoveListingSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveListingSponsor>>,
      Omit<RemoveListingSponsorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveListingSponsorParams,
    Awaited<ReturnType<typeof RemoveListingSponsor>>
  >(RemoveListingSponsor, options);
};
