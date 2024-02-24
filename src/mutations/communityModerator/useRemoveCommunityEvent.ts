import {
  COMMUNITY_EVENTS_QUERY_KEY,
  SELF_EVENT_LISTINGS_QUERY_KEY,
} from "@src/queries";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface RemoveCommunityEventParams extends MutationParams {
  communityId: string;
  eventId: string;
}

export const RemoveCommunityEvent = async ({
  communityId,
  eventId,
  clientApiParams,
  queryClient,
}: RemoveCommunityEventParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/communityModerator/${communityId}/events/${eventId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_EVENTS_QUERY_KEY(communityId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(false),
    });
  }

  return data;
};

export const useRemoveCommunityEvent = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveCommunityEvent>>,
      Omit<RemoveCommunityEventParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveCommunityEventParams,
    Awaited<ReturnType<typeof RemoveCommunityEvent>>
  >(RemoveCommunityEvent, params, options);
};
