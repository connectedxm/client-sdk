import {
  ConnectedXMResponse,
  EventEmail,
  EventEmailType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SET_LISTING_EMAIL_QUERY_DATA } from "@src/queries/listings/useGetListingEmail";

interface UpdateEmail {
  body?: string;
  replyTo?: string;
}

export interface UpdateListingEmailParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  email: UpdateEmail;
}

export const UpdateListingEmail = async ({
  eventId,
  type,
  email,
  clientApiParams,
  queryClient,
}: UpdateListingEmailParams): Promise<ConnectedXMResponse<EventEmail>> => {
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

export const useUpdateListingEmail = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateListingEmail>>,
      Omit<UpdateListingEmailParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateListingEmailParams,
    Awaited<ConnectedXMResponse<EventEmail>>
  >(UpdateListingEmail, options);
};
