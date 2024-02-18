import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUERY_KEY,
  EVENT_REGISTRANTS_QUERY_KEY,
  SELF_EVENTS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface RemoveSelfEventRegistrationCouponParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const RemoveSelfEventRegistrationCoupon = async ({
  eventId,
  registrationId,
  clientApi,
  queryClient,
  locale = "en",
}: RemoveSelfEventRegistrationCouponParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/coupon`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);

    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useRemoveSelfEventRegistrationCoupon = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventRegistrationCoupon>>,
      Omit<RemoveSelfEventRegistrationCouponParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventRegistrationCouponParams,
    Awaited<ReturnType<typeof RemoveSelfEventRegistrationCoupon>>
  >(RemoveSelfEventRegistrationCoupon, params, options);
};
