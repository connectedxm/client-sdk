import {
  ConnectedXMResponse,
  EventEmail,
  EventEmailType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SET_EVENT_LISTING_EMAIL_QUERY_DATA } from "@src/queries";
import { EventListingEmailUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventListingEmailParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  email: EventListingEmailUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventListingEmail = async ({
  eventId,
  type,
  email,
  clientApiParams,
  queryClient,
}: UpdateEventListingEmailParams): Promise<ConnectedXMResponse<EventEmail>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventEmail>>(
    `/listings/${eventId}/emails/${type}`,
    email
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_LISTING_EMAIL_QUERY_DATA(queryClient, [eventId, type], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventListingEmail = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventListingEmail>>,
      Omit<UpdateEventListingEmailParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventListingEmailParams,
    Awaited<ConnectedXMResponse<EventEmail>>
  >(UpdateEventListingEmail, options);
};
