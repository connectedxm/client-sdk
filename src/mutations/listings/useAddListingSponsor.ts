import { Account, ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_SPONSORS_QUERY_KEY, LISTING_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities";

export interface AddListingSponsorParams extends MutationParams {
  eventId: string;
  sponsor: Account;
}

export const AddListingSponsor = async ({
  eventId,
  sponsor,
  clientApiParams,
  queryClient,
}: AddListingSponsorParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sponsors`,
    {
      sponsorId: sponsor.id,
    }
  );

  if (queryClient && data.status === "ok") {
    SetSingleQueryData(
      queryClient,
      LISTING_QUERY_KEY(eventId),
      clientApiParams.locale,
      data
    );

    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useAddListingSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddListingSponsor>>,
      Omit<AddListingSponsorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddListingSponsorParams,
    Awaited<ReturnType<typeof AddListingSponsor>>
  >(AddListingSponsor, options);
};
