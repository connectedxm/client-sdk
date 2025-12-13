import {
  ConnectedXMResponse,
  EventEmail,
  EventEmailType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SET_LISTING_EMAIL_QUERY_DATA } from "@src/queries/listings/useGetListingEmail";
import { ListingEmailUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventEmailParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  email: ListingEmailUpdateInputs["email"];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventEmail = async ({
  eventId,
  type,
  email,
  clientApiParams,
  queryClient,
}: UpdateEventEmailParams): Promise<ConnectedXMResponse<EventEmail>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventEmail>>(
    `/listings/${eventId}/emails/${type}`,
    email
  );

  if (queryClient && data.status === "ok") {
    SET_LISTING_EMAIL_QUERY_DATA(queryClient, [eventId, type], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventEmail = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventEmail>>,
      Omit<UpdateEventEmailParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventEmailParams,
    Awaited<ConnectedXMResponse<EventEmail>>
  >(UpdateEventEmail, options);
};
